import _ from "underscore";
import $ from "jquery";
import Backbone from "backbone";
import { getAppRoot } from "onload/loadConfig";
import { getGalaxyInstance } from "app";
import { Toast } from "ui/toast";
import mod_library_model from "mvc/library/library-model";
import mod_library_dataset_view from "mvc/library/library-dataset-view";
import { mountNametags } from "components/Nametags";

var FolderRowView = Backbone.View.extend({
    events: {
        "click .undelete_dataset_btn": "undeleteDataset",
        "click .undelete_folder_btn": "undeleteFolder",
        "click .edit_folder_btn": "startModifications",
        "click .cancel_folder_btn": "cancelModifications",
        "click .save_folder_btn": "saveModifications"
    },

    defaults: {
        type: null,
        visibility_config: {
            edit_folder_btn: false,
            save_folder_btn: false,
            cancel_folder_btn: false,
            permission_folder_btn: false
        },
        edit_mode: false
    },

    initialize: function(options) {
        this.options = _.defaults(options || {}, this.defaults);
        this.render(this.options);
    },

    render: function(options) {
        this.options = _.extend(this.options, options);
        var folder_item = this.options.model;
        var template = null;
        const Galaxy = getGalaxyInstance();

        if (folder_item.get("type") === "folder" || folder_item.get("model_class") === "LibraryFolder") {
            this.options.type = "folder";
            this.prepareButtons(folder_item);
            if (folder_item.get("deleted")) {
                template = this.templateRowDeletedFolder();
            } else {
                template = this.templateRowFolder();
            }
        } else if (
            folder_item.get("type") === "file" ||
            folder_item.get("model_class") === "LibraryDatasetDatasetAssociation" ||
            folder_item.get("model_class") === "LibraryDataset"
        ) {
            this.options.type = "file";
            if (folder_item.get("deleted")) {
                template = this.templateRowDeletedFile();
            } else {
                template = this.templateRowFile();
            }
        } else {
            Galaxy.emit.error("Unknown library item type found.");
            Galaxy.emit.error(folder_item.get("type") || folder_item.get("model_class"));
        }
        this.setElement(
            template({
                content_item: folder_item,
                edit_mode: this.options.edit_mode,
                button_config: this.options.visibility_config
            })
        );
        this.$el.show();

        this._mountNametags("initialize");

        return this;
    },

    _mountNametags(context) {
        const container = this.$el.find(".nametags")[0];
        if (container) {
            const str_tags = this.model.get("tags");
            if (typeof str_tags === "string") {
                this.model.set({ tags: str_tags.split(", ") });
            }
            const { id, model_class, tags } = this.model.attributes;
            const storeKey = `${model_class}-${id}`;
            mountNametags({ storeKey, tags }, container);
        }
    },

    /**
     * Modify the visibility of buttons for
     * the filling of the row template of a given folder.
     */
    prepareButtons: function(folder) {
        var vis_config = this.options.visibility_config;
        if (this.options.edit_mode === false) {
            vis_config.save_folder_btn = false;
            vis_config.cancel_folder_btn = false;
            if (folder.get("deleted") === true) {
                vis_config.edit_folder_btn = false;
                vis_config.permission_folder_btn = false;
            } else if (folder.get("deleted") === false) {
                vis_config.save_folder_btn = false;
                vis_config.cancel_folder_btn = false;
                if (folder.get("can_modify") === true) {
                    vis_config.edit_folder_btn = true;
                }
                if (folder.get("can_manage") === true) {
                    vis_config.permission_folder_btn = true;
                }
            }
        } else if (this.options.edit_mode === true) {
            vis_config.edit_folder_btn = false;
            vis_config.permission_folder_btn = false;
            vis_config.save_folder_btn = true;
            vis_config.cancel_folder_btn = true;
        }
        this.options.visibility_config = vis_config;
    },

    /* Show the page with dataset details. */
    showDatasetDetails: function() {
        const Galaxy = getGalaxyInstance();
        Galaxy.libraries.datasetView = new mod_library_dataset_view.LibraryDatasetView({ id: this.id });
    },

    /* Undelete the dataset on server and render the row again. */
    undeleteDataset: function(event) {
        $(".tooltip").hide();
        const Galaxy = getGalaxyInstance();
        var that = this;
        var dataset_id = $(event.target)
            .closest("tr")
            .data("id");
        var dataset = Galaxy.libraries.folderListView.collection.get(dataset_id);
        dataset.url = `${dataset.urlRoot + dataset.id}?undelete=true`;
        dataset.destroy({
            success: function(model, response) {
                Galaxy.libraries.folderListView.collection.remove(dataset_id);
                var updated_dataset = new mod_library_model.Item(response);
                Galaxy.libraries.folderListView.collection.add(updated_dataset);
                Galaxy.libraries.folderListView.collection.sortFolder("name", "asc");
                Toast.success("Dataset undeleted. Click this to see it.", "", {
                    onclick: function() {
                        var folder_id = that.model.get("folder_id");
                        window.location = `${getAppRoot()}library/list#folders/${folder_id}/datasets/${that.id}`;
                    }
                });
            },
            error: function(model, response) {
                if (typeof response.responseJSON !== "undefined") {
                    Toast.error(`Dataset was not undeleted. ${response.responseJSON.err_msg}`);
                } else {
                    Toast.error("An error occurred! Dataset was not undeleted. Please try again.");
                }
            }
        });
    },

    /* Undelete the folder on server and render the row again. */
    undeleteFolder: function(event) {
        const Galaxy = getGalaxyInstance();
        $(".tooltip").hide();
        var folder_id = $(event.target)
            .closest("tr")
            .data("id");
        var folder = Galaxy.libraries.folderListView.collection.get(folder_id);
        folder.url = `${folder.urlRoot + folder.id}?undelete=true`;
        folder.destroy({
            success: function(model, response) {
                Galaxy.libraries.folderListView.collection.remove(folder_id);
                var updated_folder = new mod_library_model.FolderAsModel(response);
                Galaxy.libraries.folderListView.collection.add(updated_folder);
                Galaxy.libraries.folderListView.collection.sortFolder("name", "asc");
                Toast.success("Folder undeleted.");
            },
            error: function(model, response) {
                if (typeof response.responseJSON !== "undefined") {
                    Toast.error(`Folder was not undeleted. ${response.responseJSON.err_msg}`);
                } else {
                    Toast.error("An error occurred! Folder was not undeleted. Please try again.");
                }
            }
        });
    },

    /* User clicked the 'edit' button on row so render the row as editable. */
    startModifications: function() {
        this.options.edit_mode = true;
        this.repaint();
    },

    /* User clicked the 'cancel' button so render normal row */
    cancelModifications: function() {
        this.options.edit_mode = false;
        this.repaint();
    },

    saveModifications: function() {
        const Galaxy = getGalaxyInstance();
        var folder = Galaxy.libraries.folderListView.collection.get(this.$el.data("id"));
        var is_changed = false;
        var new_name = this.$el.find(".input_folder_name").val();
        if (typeof new_name !== "undefined" && new_name !== folder.get("name")) {
            if (new_name.length > 2) {
                folder.set("name", new_name);
                is_changed = true;
            } else {
                Toast.warning("Folder name has to be at least 3 characters long.");
                return;
            }
        }
        var new_description = this.$el.find(".input_folder_description").val();
        if (typeof new_description !== "undefined" && new_description !== folder.get("description")) {
            folder.set("description", new_description);
            is_changed = true;
        }
        if (is_changed) {
            var row_view = this;
            folder.save(null, {
                patch: true,
                success: function(folder) {
                    row_view.options.edit_mode = false;
                    row_view.repaint(folder);
                    Toast.success("Changes to folder saved.");
                },
                error: function(model, response) {
                    if (typeof response.responseJSON !== "undefined") {
                        Toast.error(response.responseJSON.err_msg);
                    } else {
                        Toast.error("An error occurred while attempting to update the folder.");
                    }
                }
            });
        } else {
            this.options.edit_mode = false;
            this.repaint(folder);
            Toast.info("Nothing has changed.");
        }
    },

    repaint: function() {
        /* need to hide manually because of the element removal in setElement
    invoked in render() */
        $(".tooltip").hide();
        /* we need to store the old element to be able to replace it with
    new one */
        var old_element = this.$el;
        /* if user canceled the folder param is undefined,
      if user saved and succeeded the updated folder is rendered */
        this.render();
        old_element.replaceWith(this.$el);
        /* now we attach new tooltips to the newly created row element */
        this.$el.find('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    },

    templateRowFolder: function() {
        return _.template(
            `<tr class="folder_row library-row" data-id="<%- content_item.id %>">
                <td class="mid">
                    <span title="Folder" class="fa fa-folder-o"></span>
                </td>
                <td class="mid"><input style="margin: 0;" type="checkbox"></td>
                <% if(!edit_mode) { %>
                    <td>
                        <a href="#folders/<%- content_item.id %>"><%- content_item.get("name") %></a>
                    </td>
                    <% if( content_item.get("description") ) { %>
                        <% if( content_item.get("description").length> 80 ) { %>
                            <td data-toggle="tooltip" data-placement="auto"
                                title='<%= _.escape(content_item.get("description")) %>'>
                                <%= _.escape(content_item.get("description")).substring(0, 80) + "..." %>
                            </td>
                        <% } else { %>
                            <td><%= _.escape(content_item.get("description"))%></td>
                        <% } %>
                    <% } else { %>
                        <td></td>
                    <% } %>
                <% } else if(edit_mode){ %>
                    <td>
                        <textarea rows="4" class="form-control input_folder_name" placeholder="name" ><%- content_item.get("name") %></textarea>
                    </td>
                    <td>
                        <textarea rows="4" class="form-control input_folder_description" placeholder="description" ><%- content_item.get("description") %></textarea>
                    </td>
                <% } %>
                <td></td>
                <td>folder</td>
                <td></td>
                <td>
                    <%= _.escape(content_item.get("update_time")) %>
                </td>
                <td></td>
                <td class="right-center">
                    <% if(edit_mode) { %> <!-- start edit mode -->
                        <button data-toggle="tooltip" data-placement="top" title="Save changes"
                            class="primary-button btn-sm save_folder_btn" type="button"
                            style="<% if(button_config.save_folder_btn === false) { print("display:none;") } %>">
                            <span class="fa fa-floppy-o"></span> Save
                        </button>
                        <button data-toggle="tooltip" data-placement="top" title="Discard changes"
                            class="primary-button btn-sm cancel_folder_btn" type="button"
                            style="<% if(button_config.cancel_folder_btn === false) { print("display:none;") } %>">
                            <span class="fa fa-times"></span> Cancel
                        </button>
                    <% } else if (!edit_mode){%> <!-- start no edit mode -->
                        <button data-toggle="tooltip" data-placement="top"
                            title="Modify '<%- content_item.get("name") %>'"
                            class="primary-button btn-sm edit_folder_btn" type="button"
                            style="<% if(button_config.edit_folder_btn === false) { print("display:none;") } %>">
                            <span class="fa fa-pencil"></span> Edit
                        </button>
                        <a href="#/folders/<%- content_item.id %>/permissions">
                            <button data-toggle="tooltip" data-placement="top"
                                class="primary-button btn-sm permission_folder_btn"
                                title="Permissions of '<%- content_item.get("name") %>'"
                                    style="<% if(button_config.permission_folder_btn === false) { print("display:none;") } %>">
                                <span class="fa fa-group"></span> Manage
                            </button>
                        </a>
                    <% } %> <!-- end no edit mode -->
               </td>
            </tr>`
        );
    },

    templateRowFile: function() {
        return _.template(
            `<tr style="display: table-row;" class="dataset_row library-row" data-id="<%- content_item.id %>">
                <td class="mid">
                    <span title="Dataset" class="fa fa-file-o"></span>
                </td>
                <td class="mid">
                    <input style="margin: 0;" type="checkbox">
                </td>
                <td>
                    <a href="#folders/<%- content_item.get("folder_id") %>/datasets/<%- content_item.id %>"
                        class="library-dataset">
                        <%- content_item.get("name") %>
                    <a>
                </td>
                <td><%- content_item.get("message") %></td>
                <td><div class="nametags"><!-- Nametags mount here --></div></td>
                <td><%= _.escape(content_item.get("file_ext")) %></td>
                <td><%= _.escape(content_item.get("file_size")) %></td>
                <td><%= _.escape(content_item.get("update_time")) %></td>
                <td>
                    <% if ( content_item.get("state") !== "ok" ) { %>
                        <%= _.escape(content_item.get("state")) %>
                    <% } %>
                </td>
                <td class="right-center">
                    <% if (content_item.get("is_unrestricted")) { %>
                        <span data-toggle="tooltip" data-placement="top" title="Unrestricted dataset"
                            class="fa fa-globe"></span>
                    <% } %>
                    <% if (content_item.get("is_private")) { %>
                        <span data-toggle="tooltip" data-placement="top" title="Private dataset"
                            class="fa fa-key"></span>
                    <% } %>
                    <% if ((content_item.get("is_unrestricted") === false) && (content_item.get("is_private") === false)) { %>
                        <span data-toggle="tooltip" data-placement="top" title="Restricted dataset"
                            class="fa fa-shield"></span>
                    <% } %>
                    <% if (content_item.get("can_manage")) { %>
                        <a href="#folders/<%- content_item.get("folder_id") %>/datasets/<%- content_item.id %>/permissions">
                            <button data-toggle="tooltip" data-placement="top"
                                class="primary-button btn-sm permissions-dataset-btn"
                                title="Permissions of '<%- content_item.get("name") %>'">
                                <span class="fa fa-group"></span> Manage
                            </button>
                        </a>
                    <% } %>
                </td>
            </tr>`
        );
    },

    templateRowDeletedFile: function() {
        return _.template(
            `<tr class="active deleted_dataset library-row" data-id="<%- content_item.id %>">
                <td class="mid">
                    <span title="Dataset" class="fa fa-file-o"></span>
                </td>
                <td></td>
                <td style="color:grey;">
                    <%- content_item.get("name") %>
                </td>
                <td>
                    <%- content_item.get("message") %>
                </td>
                <td>
                    <div class="nametags"><!-- Nametags mount here --></div>
                </td>
                <td>
                    <%= _.escape(content_item.get("file_ext")) %>
                </td>
                <td>
                    <%= _.escape(content_item.get("file_size")) %>
                </td>
                <td>
                    <%= _.escape(content_item.get("update_time")) %>
                </td>
                <td>
                    <% if ( content_item.get("state") !== "ok" ) { %>
                        <%= _.escape(content_item.get("state")) %>
                    <% } %>
                </td>
                <td class="right-center">
                    <span data-toggle="tooltip" data-placement="top"
                        title="Marked deleted" class="fa fa-ban"></span>
                    <button data-toggle="tooltip" data-placement="top"
                        title="Undelete '<%- content_item.get("name") %>'"
                        class="primary-button btn-sm undelete_dataset_btn" type="button" style="margin-left:1em;">
                        <span class="fa fa-unlock"></span> Undelete
                    </button>
                </td>
            </tr>`
        );
    },

    templateRowDeletedFolder: function() {
        return _.template(
            `<tr class="active deleted_folder library-row" data-id="<%- content_item.id %>">
                <td class="mid">
                    <span title="Folder" class="fa fa-folder-o"></span>
                </td>
                <td></td>
                <td style="color:grey;">
                    <%- content_item.get("name") %>
                </td>
                <% if( content_item.get("description") ) { %>
                    <% if( content_item.get("description").length> 80 ) { %>
                        <td data-toggle="tooltip" data-placement="bottom"
                            title='<%= _.escape(content_item.get("description")) %>'>
                            <%= _.escape(content_item.get("description")).substring(0, 80) + "..." %>
                        </td>
                    <% } else { %>
                        <td><%= _.escape(content_item.get("description"))%></td>
                    <% } %>
                <% } else { %>
                    <td></td>
                <% } %>
                <td></td>
                <td>
                    folder
                </td>
                <td></td>
                <td>
                    <%= _.escape(content_item.get("update_time")) %>
                </td>
                <td></td>
                <td class="right-center">
                    <span data-toggle="tooltip" data-placement="top"
                        title="Marked deleted" class="fa fa-ban"></span>
                    <button data-toggle="tooltip" data-placement="top"
                        title="Undelete '<%- content_item.get("name") %>'"
                        class="primary-button btn-sm undelete_folder_btn" type="button" style="margin-left:1em;">
                        <span class="fa fa-unlock"></span> Undelete
                    </button>
                </td>
            </tr>`
        );
    }
});

export default {
    FolderRowView: FolderRowView
};
