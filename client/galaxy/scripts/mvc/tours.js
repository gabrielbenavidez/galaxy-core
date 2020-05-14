/**
 *  This is the primary galaxy tours definition, currently only used for
 *  rendering a tour menu.
 */

import _l from "utils/localization";
// The following must remain staged out of libs and not sourced from
// node_modules, until TDTs are bundled.
import _ from "underscore";
import $ from "jquery";
import Backbone from "backbone";
import { getAppRoot } from "onload/loadConfig";
import "libs/bootstrap-tour";

// bootstrap-tour configures a window.Tour object; keep a local ref.
const Tour = window.Tour;

// For buttons to show, we need to add them to bootstrap/popper's sanitizing filters.
$.fn.tooltip.Constructor.Default.whiteList.button = ["data-role"];

var gxy_root = getAppRoot();

const TOURPAGE_TEMPLATE = `
    <h2>Galaxy Tours</h2>
    <p>This page presents a list of interactive tours available on this Galaxy server.
    Select any tour to get started (and remember, you can click 'End Tour' at any time).</p>

<div class="row mb-3">
    <div class="col-12 btn-group" role="group" aria-label="Tag selector">
        <% _.each(tourtagorder, function(tag) { %>
        <button class="btn btn-primary tag-selector-button" tag-selector-button="<%- tag.key %>">
            <%- tag.name %>
        </button>
        <% }); %>
    </div>
</div>

<div class="row mb-3">
    <div class="col-12">
    <h4>Tours</h4>
    <ul class="list-group">
    <% _.each(tours, function(tour) { %>
        <li class="list-group-item" tags="<%- tour.attributes.tags_lc %>">
            <a href="/tours/<%- tour.id %>" class="tourItem" data-tour.id=<%- tour.id %>>
                <%- tour.attributes.name || tour.id %>
            </a>
             - <%- tour.attributes.description || "No description given." %>
             <% _.each(tour.attributes.tags, function(tag) { %>
                <span class="badge badge-primary">
                    <%- tag.charAt(0).toUpperCase() + tag.slice(1) %>
                </span>
             <% }); %>
        </li>
    <% }); %>
    </ul>
    </div>
</div>`;

var tour_opts = {
    storage: window.sessionStorage,
    onEnd: function() {
        window.sessionStorage.removeItem("activeGalaxyTour");
    },
    delay: 150, // Attempts to make it look natural
    orphan: true
};

var microbiome_tour = {
    name: "microbiome_tour",
    steps: [
        {
            title: "Welcome to the Microbiome Tour!",
            content: "This short tour will guide you through the <b>Microbiome Pipeline</b> execution. <br>You can navigate the tour using the <b>Next</b> and <b>Prev</b> keys.<br> You can quit the tour at any time by pressing the <b>End tour</b> button <br> or the <b>Esc</b> key on your keyboard.",
            element: "#center > div",
            placement: "bottom",
            onShow: function(tour){
                $("#galaxy_main").attr('src','/welcome');
            }
        },
        {
            title: "Shared Data",
            element: "#shared a[href$='/library/index']",
            content: "Select the <b>Shared Data</b> dropdown menu.",
            placement: "left",
            onShow: function(){
                $("#shared a[href$='/library/index']").attr("data-original-title","Shared Data");
            }
        },
        {
            title: "Data Libraries",
            element: "a[href$='/library/list']",
            content: "Select <b>Data Libraries</b>. <br>You will be redirected to the data libraries page <br>where you can view your shared data libraries.",
            placement: "right",
            onShow: function(tour){
                $("#shared a[href$='/library/index']").click();
            }
        },
        {
            title: "Microbiome Input Data",
            element: 'a[href="#folders/F33b43b4e7093c91f"]',
            content: "Select <b>Microbiome Input Data</b>.",
            placement: "right",
            path: "/library/list"
        },
        {
            title: "Export to History",
            element: "#center > div > div:nth-child(1) > div > form > div:nth-child(4) > button",
            content: "Select the <b>Export to history</b> dropdown menu to export the <br> Microbiome Input Data to your history.",
            placement: "left",
            delay:2700,
            path: "/library/list/#folders/F33b43b4e7093c91f"
        },
        {
            title: "Export as Collection",
            element: "#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div > a.toolbtn-collection-import.add-to-history-collection.dropdown-item",
            content: "Select <b>as Collection</b> to export the data as a collection.",
            placement: "right",
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4)").addClass("show");
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div").addClass("show");
            },
        },
        {
            title: "Select All Datasets",
            element: "body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div:nth-child(1) > form > div:nth-child(2) > label",
            content: "Select <b>all datasets in current folder</b>.",
            placement: "top",
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div > a.toolbtn-collection-import.add-to-history-collection.dropdown-item").click();
            },
            onPrev: function(tour){
                $("#button-1").click();
            }
        },
        {
            title: "Create New History",
            element: "body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div:nth-child(3) > h4",
            content: "A new history will be created for this tour named <b>Microbiome Tour<b/>.",
            placement: "top",
            onShow: function(tour){
                $(".modal-body").animate({ scrollTop: $(document).height() }, 1000);
                $("body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div:nth-child(3) > div > input").val("Microbiome Tour");
            }
        },
        {
            title: "Confirm Choices",
            element: "#button-0",
            content:"Select <b>Continue</b> to confirm your choices.",
            placement: "top",
            onNext: function(tour){
                $("#button-0").click();
            }
        },
        {
            title: "Collection Name",
            element: "body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div.footer.flex-row.no-flex > div.attributes.clear > div:nth-child(2) > div",
            content:"The collection is named <b>Microbiome Input Data</b> by default.<br> However, you may enter a different name for the collection.",
            placement: "left",
            delay: 1000,
            onShown: function(tour){
                $("body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div.footer.flex-row.no-flex > div.attributes.clear > div:nth-child(2) > input").val("Microbiome Input Data").trigger("change");
            }
        },
        {
            title: "Create List",
            element: "body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div.footer.flex-row.no-flex > div.actions.clear.vertically-spaced > div.main-options.float-right > button",
            content: "Select <b>Create list</b> to finish exporting the dataset collection.",
            placement: "left",
            onNext: function(tour){
                $("body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div.footer.flex-row.no-flex > div.actions.clear.vertically-spaced > div.main-options.float-right > button").click();
            }
        },
        {
            title: "Data Libraries",
            element: "#first_folder_item > td:nth-child(1) > a.btn_open_folder.btn.btn-secondary.btn-sm",
            content: "Go back to the shared <b>data libraries</b> page.",
            placement: "left",
            delay :1000,
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4)").removeClass("show");
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div").removeClass("show");
                $("body > div.modal.ui-modal > div.modal-dialog > div > div.modal-body > div > div.footer.flex-row.no-flex > div.actions.clear.vertically-spaced > div.other-options.float-left > button").click();
            }
        },
        {
            title: "Export Microbiome Supporting Data",
            element: 'a[href="#folders/F1cd8e2f6b131e891"]',
            content: "Export the <b>Microbiome Supporting Data</b> to your history.",
            placement: "right",
            path: "/library/list/",
        },
        {
            title: "Select All Datasets",
            element: "#select-all-checkboxes",
            placement: "right",
            content: "Click the checkbox to select all datasets.",
            path: "/library/list#folders/F1cd8e2f6b131e891",
            delay: 1000,
            onShown: function(tour) {
                $("#select-all-checkboxes").click();
            }
        }, 
        {
            title: "Microbiome Supporting Data",
            element: "#center > div > div:nth-child(1) > div > form > div:nth-child(4) > button",
            content: "To export the Microbiome Supporting Data <br>select the <b>Export to History</b> dropdown menu.",
            placement: "left",
        },
        {
            title: "Microbiome Supporting Data",
            element: "#center > div > div:nth-child(1) > div > form > div.dropdown.mr-1.show > div > a.toolbtn-bulk-import.add-to-history-datasets.dropdown-item",
            content: "Export as a dataset by selecting <b>as Datasets</b>.",
            placement: "right",
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4)").addClass("show");
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div").addClass("show");
            },
        },
        {   
            title: "Add Collection to History",
            element: "body > div.modal.ui-modal > div.modal-dialog > div > div.modal-header > h4",
            placement: "right",
            content: "Add the collection to The <b>Microbiome Tour</b> history used for the Micrrobiome Input Data.",
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div.dropdown.mr-1.show > div > a.toolbtn-bulk-import.add-to-history-datasets.dropdown-item").click();
            }
        },
        {
            title: "Import Datasets to History",
            element: "#button-0",
            placement : "left",
            content: "Select <b>Import</b> to import the dataset into your history.",
            onNext: function(tour){
                $("#button-0").click();
                $("#button-1").click();
            },
        }, 
        {
            title: "Shared Data",
            element: "#shared a[href$='/library/index']",
            content: " Select <b>Shared Data</b> to view the dropdown menu.",
            placement: "left",
            delay: 1300,
            onShow: function(tour){
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4)").removeClass("show");
                $("#center > div > div:nth-child(1) > div > form > div:nth-child(4) > div").removeClass("show");
                $("#shared a[href$='/library/index']").attr("data-original-title","Shared Data");
            }
        },
        {
            title: "Workflows",
            element: "#shared > div.dropdown-menu > a:nth-child(3)",
            content: "Select <b>Workflows</b> to view shared Workflows.",
            placement: "right",
            onShow: function(tour){
                $("#shared a[href$='/library/index']").click();
            }
        },
        {
            title: "View Workflow Options",
            element: "#grid-f09437b8822035f7-popup",
            content: "Click the dropdown to show Workflow options.",
            placement: "top",
            path: "/workflows/list_published",
            delay: 1200
        },
        {
            title: "Workflow Input",
            element: "#grid-f09437b8822035f7-popup-menu > a:nth-child(1)",
            content: "Select <b>Run</b> to begin selecting input for the Workflow.",
            placement: "right",
            onShow: function(tour){
                var offset = $("#grid-f09437b8822035f7-popup").offset();
                var target_top = offset.top;
                var target_left = offset.left;
                var top = target_top+20;
                var left = target_left+10;
                $("#grid-f09437b8822035f7-popup").click();
                $("body > div.popmenu-wrapper").css('top',top);
                $("body > div.popmenu-wrapper").css('left',left);
            }
        },
        {
            title: "Select the input datasets from your history.",
            element: "#center > div > div > div > div.h4 > b",
            content: "Select the appropriate datasets as workflow inputs from the Microbiome Tour history.",
            placement: "bottom",
            path: "/workflows/run?id=f09437b8822035f7",
            delay: 3700 
        },
        {
            title: "Input Dataset Collection",
            element: "#uid-18 > div.portlet-header > div.portlet-title > span",
            content: "The correct dataset collection <b>Microbiome Input Data</b> is selected",
            placement: "top"
        },
        {
            title: "Complete OTU Table",
            element: "#uid-35 > div.portlet-header > div.portlet-title > span",
            content: "The correct Input dataset <b>otu_table_Georgetown_complete.txt</b> is selected.",
            placement: "top"
        },
        {
            title: "Fasta File",
            element: "#uid-43 > div.portlet-header > div.portlet-title > span",
            content: "The correct Fasta File input <b>99_otus.fasta</b> is not selected.",
            placement: "top"
        },
        {
            title: "Fasta File",
            element: "#uid-42",
            content: "Find the <b>99_otus.fasta</b> input file by clicking the browswer icon to open the file browser window.",
            placement: "left"
        },
        {
            title: "Fasta File",
            content: "select <b>99_otus.fasta</b>.",
            element: "table > tbody > tr:nth-child(5) > td:nth-child(1)",
            placement: "top",
            delay: 1700,
            container: ".modal-content",
            onShow: function(){
                $("#uid-42").click();
            },
            onHidden: function(){
                $("table > tbody > tr:nth-child(5) > td:nth-child(1)").click();
            }
        },
        {
            title: "Subject ID",
            element: "#uid-51 > div.portlet-header > div.portlet-title > span",
            content: "The correct Subject ID input <b>midas-mapping-group_subjectID.txt</b> is not selected.",
            placement: "top",
            onShow: function(){
                $('#center > div > div > div > div.ui-steps').animate({scrollTop: ($('#uid-18 > div.portlet-header > div.portlet-title > span').offset().top)},1000);
            }
        },
        {
            title: "Subject ID",
            element: "#uid-50",
            content: "Select the correct dataset input by clicking the file browswer icon to open the file browser window.",
            placement: "left"
        },
        {
            title: "Subject ID",
            element: "table > tbody > tr:nth-child(2) > td:nth-child(1)",
            content: "Select <b>midas-mapping-group_subjectID.txt</b>.",
            delay: 1700,
            container: ".modal-content",
            placement: "bottom",
            onShow: function(){
                $("#uid-50").click();
            },
            onHidden: function(){
                $("table > tbody > tr:nth-child(2) > td:nth-child(1)").click();
            }
        },
        {
            title: "Taxonomy",
            element: "#uid-59 > div.portlet-header > div.portlet-title > span",
            content: "The correct Taxonomy input <b>99_otu_taxonomy.txt</b> is not selected.",
            placement: "top"
        },
        {
            title: "Taxonomy",
            element: "#uid-58",
            content: "Select the correct dataset input by clicking the file browswer icon to open the file browser window.",
            placement: "left"
        },
        {
            title: "Taxonomy",
            element: "table > tbody > tr:nth-child(4) > td:nth-child(1)",
            content: "Select <b>99_otu_taxonomy.txt</b>.",
            delay: 1700,
            container: ".modal-content",
            placement: "top",
            onShow: function(){
                $("#uid-58").click();
            },
            onHidden: function(){
                $("table > tbody > tr:nth-child(4) > td:nth-child(1)").click();
            }
        },
        {
            title: "Metadata File",
            element: "#uid-67 > div.portlet-header > div.portlet-title > span",
            content: "The correct Metadata File input <b>midas-mapping-group_for_Patty.xlsx</b> is not selected.",
            placement: "top"
        },
        {
            title: "Metadata File",
            element: "#uid-66",
            content: "Select the correct dataset input by clicking the file browswer icon to open the file browser window.",
            placement: "left"
        },
        {
            title: "Metadata File",
            element: "table > tbody > tr:nth-child(3) > td:nth-child(1)",
            content: "Select <b>midas-mapping-group_for_Patty.xlsx</b>.",
            delay: 1700,
            container: ".modal-content",
            placement: "top",
            onShow: function(){
                $("#uid-66").click();
            },
            onHidden: function(){
                $("table > tbody > tr:nth-child(3) > td:nth-child(1)").click();
            }
        },
        {
            title : "Run Workflow",
            element: "#run-workflow",
            content: "Click the <b>Run Workflow</b> button to start running the Workflow.<br> This is the end of the tour! you may click <b>End Tour</b> to exit.",
            onHide: function(){
                $("#run-workflow").click();
            }
        }
      ],
    storage: window.sessionStorage,
    onEnd: function() {
        window.sessionStorage.removeItem("activeGalaxyTour");
    },
    delay: 630, // Attempts to make it look natural
    orphan: false
};

var hooked_tour_from_data = data => {
    _.each(data.steps, step => {
      
        if (step.preclick) {
            step.onShow = () => {
                _.each(step.preclick, preclick => {
                    // TODO: click delay between clicks
                    $(preclick).click();
                });
            };
        }
        if (step.postclick) {
            step.onHide = () => {
                _.each(step.postclick, postclick => {
                    // TODO: click delay between clicks
                    $(postclick).click();
                });
            };
        }
     
      
        if (step.textinsert) {
            // Have to manually trigger a change here, for some
            // elements which have additional logic, like the
            // upload input box
            step.onShown = () => {
                $(step.element)
                    .val(step.textinsert)
                    .trigger("change");
            };
        }
        
        if (step.path) {
            // Galaxy does *not* support automagic path navigation right now in
            // Tours -- too many ways to get your client 'stuck' in automatic
            // navigation loops.  We can probably re-enable this as our client
            // routing matures.
            console.warn(
                "This Galaxy Tour is attempting to use path navigation.  This is known to be unstable and can possibly get the Galaxy client 'stuck' in a tour, and at this time is not allowed."
            );
            delete step.path;
        }
    });
    return data;
};

var TourItem = Backbone.Model.extend({
    urlRoot: `${gxy_root}api/tours`
});

var Tours = Backbone.Collection.extend({
    url: `${gxy_root}api/tours`,
    model: TourItem
});

export var ToursView = Backbone.View.extend({
    title: _l("Tours"),
    initialize: function() {
        var self = this;
        this.setElement("<div/>");
        this.model = new Tours();
        this.model.fetch({
            success: function() {
                self.render();
            },
            error: function() {
                // Do something.
                console.error("Failed to fetch tours.");
            }
        });
    },

    render: function() {
        var tpl = _.template(TOURPAGE_TEMPLATE);

        var tourtags = {};
        _.each(this.model.models, tour => {
            tour.attributes.tags_lc = [];
            if (tour.attributes.tags === null) {
                if (tourtags.Untagged === undefined) {
                    tourtags.Untagged = { name: "Untagged", tours: [] };
                }
                tourtags.Untagged.tours.push(tour);
            } else {
                _.each(tour.attributes.tags, otag => {
                    var tag = otag.charAt(0).toUpperCase() + otag.slice(1);
                    if (tourtags[tag] === undefined) {
                        tourtags[tag] = { name: tag, tours: [] };
                    }
                    tour.attributes.tags_lc.push(otag.toLowerCase());
                    tourtags[tag].tours.push(tour);
                });
            }
        });
        //var tourtagorder = Object.keys(tourtags).sort();
        var tourtagorder = [];
        Object.keys(tourtags).forEach(function(tag, index) {
            tourtagorder.push({ name: tag, key: tag.toLowerCase() });
        });

        this.$el
            .html(
                tpl({
                    tours: this.model.models,
                    tourtags: tourtags,
                    tourtagorder: tourtagorder
                })
            )
            .on("click", ".tourItem", function(e) {
                e.preventDefault();
                giveTourById($(this).data("tour.id"));
            })
            .on("click", ".tag-selector-button", e => {
                var elem = $(e.target);
                var active_tags = [];

                // Switch classes for the buttons
                elem.toggleClass("btn-primary");
                elem.toggleClass("btn-secondary");

                // Get all non-disabled tags
                $(`.tag-selector-button.btn-primary`).each(function() {
                    active_tags.push($(this).attr("tag-selector-button"));
                });

                // Loop over all list items, subsequently determine these are
                // only the tours (tags should be unique). Then use the non-disabled tags to
                // determien whether or not to display this specific tour.
                $(`li.list-group-item`).each(function() {
                    if ($(this).attr("tags")) {
                        var tour_tags = [];
                        var tour_tags_html = $(this).attr("tags");

                        tour_tags = tour_tags_html.split(",");
                        var fil_tour_tags = tour_tags.filter(function(tag) {
                            return active_tags.indexOf(tag.toLowerCase()) > -1;
                        });

                        $(this).css("display", fil_tour_tags.length > 0 ? "block" : "none");
                    }
                });
            });
    }
});

export function giveTourWithData(data) {
    const hookedTourData = hooked_tour_from_data(data);
    window.sessionStorage.setItem("activeGalaxyTour", JSON.stringify(data));
    // Store tour steps in sessionStorage to easily persist w/o hackery.
    const tour = new Tour(_.extend({ steps: hookedTourData.steps }, tour_opts));
    // Always clean restart, since this is a new, explicit execution.
    tour.init();
    tour.goTo(0);
    tour.restart();
    return tour;
}



export function giveTourById(tour_id) {
    var url = `${gxy_root}api/tours/${tour_id}`;
    if(tour_id == 'microbiome_tour'){
        giveMicrobiomeTour(microbiome_tour);
    }
    else{
        $.getJSON(url, data => {
            giveTourWithData(data);
        });
    }
}

function giveMicrobiomeTour(data){
    window.sessionStorage.setItem("activeGalaxyTour", JSON.stringify(data));
    // Store tour steps in sessionStorage to easily persist w/o hackery.
    const tour = new Tour(microbiome_tour);
    // Always clean restart, since this is a new, explicit execution.
    tour.init();
    tour.goTo(0);
    tour.restart();
    return tour;
}

function restartMicrobiomeTour(){
    if (window && window.self === window.top) {
        // Only kick off a new tour if this is the toplevel window (non-iframe).  This
        // functionality actually *could* be useful, but we'd need to handle it better and
        // come up with some design guidelines for tours jumping between windows.
        // Disabling for now.
        var tour = new Tour(microbiome_tour);
        tour.init();
        tour.restart();
    }
}

export function activeGalaxyTourRunner() {
    var et = JSON.parse(window.sessionStorage.getItem("activeGalaxyTour"));
    if (et) {
        if(et.name === 'microbiome_tour'){
            restartMicrobiomeTour();
        }
        else{
            et = hooked_tour_from_data(et);
            if (et && et.steps) {
                if (window && window.self === window.top) {
                    // Only kick off a new tour if this is the toplevel window (non-iframe).  This
                    // functionality actually *could* be useful, but we'd need to handle it better and
                    // come up with some design guidelines for tours jumping between windows.
                    // Disabling for now.
                    var tour = new Tour(
                        _.extend(
                            {
                                steps: et.steps
                            },
                            tour_opts
                        )
                    );
                    tour.init();
                    tour.restart();
                }
            }
        }
    }
}

export default {
    ToursView: ToursView,
    giveTourWithData: giveTourWithData,
    giveTourById: giveTourById,
    activeGalaxyTourRunner: activeGalaxyTourRunner
};
