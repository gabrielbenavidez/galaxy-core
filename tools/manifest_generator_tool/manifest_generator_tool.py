# import pandas as pd 
# import argparse 
# import xlrd
# import sys


# #--------------Default values --------------------
# studyIdColumn = "dbgap_microbiome_sraruninfo108Dbgap_microbiome_sraruninfo_dbgap_study_accession"
# SRRIdColumn = "dbgap_microbiome_sraruninfo108Dbgap_microbiome_sraruninfo_Run"
# baseFilePath = "/home/manager/Dev/galaxy/manifest_files" 
# defaultOutputName = "manifest.tsv"

# #-----------------------Command Line Arguments-----------------
# parser = argparse.ArgumentParser(description="Creates a TSV manifest file from a CSV query result") 
# parser.add_argument('-i', '--input', help=' Input CSV file you want to generate manifest file for.', default='/home/manager/galaxy/tools/manifest_generator_tool/test.csv' ,required=False) 
# parser.add_argument('-o', '--out', help='Name of output file: just the mae e.g. "manifest".', default=defaultOutputName, required=False) 
# parser.add_argument('-p', '--path', help='Path to the Sample Id files.', default=baseFilePath, required=False) 
# args = parser.parse_args() 

# outputName = str(args.out)
# csvInput = str(args.input) 
# filePath = str(args.path)


# #------------ create the manifest file -----------------
# def createManifestFile(manifest):
# 	try:
# 		with open(outputName, 'w') as fileWriter:
# 			for entry in manifest:
# 				fileWriter.write(entry+"{}".format("\n"))
# 			fileWriter.close()
# 		print("Manifest generated")
# 	except Exception as e:
# 		print("Error saving {}".format(outputName))





# # ----------- append manifest entries ------------------
# def generateManifest(csv):
# 	manifest = []
# 	headers = ['sample-id', 'forward-absolute-filepath', 'reverse-absolute-filepath']
# 	manifest.append('\t'.join(headers))	
# 	try:
# 		SRRIds = csv[SRRIdColumn]
# 	except Exception as e:
# 		print("No SRR Id column available for the current CSV file.")
# 		sys.exit(1)
# 	rowIndex = 0
# 	for SRRId in SRRIds:
# 		try:
# 			studyId = csv[SRRIds == SRRId][studyIdColumn][rowIndex]
# 		except Exception as e:
# 			print("No study Id column available for the current CSV file.")
# 			sys.exit(1)
# 		forwardAbsoluteFilepath = '{0}/{1}/{2}_1.fastq.gz'.format(filePath, studyId, SRRId)
# 		reverseAbsoluteFilepath = '{0}/{1}/{2}_2.fastq.gz'.format(filePath, studyId, SRRId)
# 		manifestEntry = [SRRId, forwardAbsoluteFilepath, reverseAbsoluteFilepath]
# 		manifest.append('\t'.join(manifestEntry))
# 		rowIndex+=1
# 	createManifestFile(manifest)



# #---------------parse csv file -------------------------
# try:
# 	csv = pd.read_csv(csvInput, sep=",", header=0)
# 	generateManifest(csv)
# except IOError as e:
# 	print("Unable to read {}".format(csvInput))
# 	sys.exit(1)

    







