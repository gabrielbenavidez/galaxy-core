__author__= 'Haibin Guan' 
import argparse 
import os 
import pandas,numpy
"""Script allows you to convert the taxonomy csv file obtained from collapsing certain level taxonomy file in qiime2 and then convert it to percent abundance and transforms it"""

indexName="#OTU ID"
df=None
#------------method for checking if the file has already been modified and sets index name accordingly--------
def readTable():
	global indexName
	global df
	try:
		df=pandas.read_csv(csvfile, sep="\t", header=0, index_col=0)
		indexName="taxonomy"
		return df
	except Exception:
		try:
			df=pandas.read_csv(csvfile, sep="\t", header=1, index_col=0)
			return df
		except Exception:
			print('File {} cannot be read'.format(csvfile))


#-----------Command Line Arguments-----------------
parser=argparse.ArgumentParser(description="Script allows you to convert the taxonomy csv file obtained from collapsing certain level taxonomy file in qiime2") 
parser.add_argument('-i','--input', help=' Input csv file you want covnert to percentage',required=True) 
parser.add_argument('-o','--out', help='Name of output file: jsut the mae e.g., "Percent_taxa-L7"', required=True)#require later 
args = parser.parse_args() 
o_file=str(args.out) 
csvfile=str(args.input)

#-----------open csv file in with pandas and only include patient and bacteria metadata remove all other metadata information -------
print ("Retrieving percent abundance")
df=readTable()
index= [c for c in df.columns ] 
dfp=pandas.pivot_table(df,values=index,index=indexName,aggfunc=sum) 
df=dfp.transpose() 
cols = [c for c in df.columns if c[0] == 'k' or c[0]=='t'] 
df=df[cols]

#--------------- Convert raw counts to percentages -------
dft=df 
dft[cols] = dft[cols].div(dft[cols].sum(axis=1), axis=0) 
dft=dft.transpose() 
dft.index.name='taxonomy' 
dft.to_csv(o_file,sep='\t') 
print ("Done :)")


