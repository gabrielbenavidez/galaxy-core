# import pandas as pd 
# import argparse 
# import xlrd
# #-----------Command Line Arguments-----------------
# parser = argparse.ArgumentParser(description="Script allows you to convert the taxonomy csv file obtained from collapsing certain level taxonomy file in qiime2") 
# parser.add_argument('-i', 
# '--input', help=' Input tsv file you want to fix sample names', required=True) 
# parser.add_argument('-m', '--metadata', help='File containing the naming information', required=True) 
# parser.add_argument('-o', '--out', help='Name of output file: just the mae e.g., "Percent_taxa-L7"', required=True) 
# parser.add_argument('-c', '--matchcol',help="Name of the column to match" , required=True)
# parser.add_argument('-s', '--swapcol',help="Name of the column to swap with" , required=True)
# args = parser.parse_args() 
# out_file = str(args.out) 
# tsvfile = str(args.input) 
# xlsxfile = str(args.metadata)
# match_col = str(args.matchcol)
# swap_col = str(args.swapcol)


# #-----------open tsv file and get IDs to swap -----------------
# toSwap=pd.read_csv(tsvfile, sep="\t", header=0, index_col=0)
# column_length=toSwap.shape[1]

# #-----------open xlsx file and extract columns A and I -----------------
# swapper = pd.read_excel(xlsxfile, na_values='Missing', header=0) 
# row_length=swapper.shape[0]

# match_column = swapper.columns.get_loc(match_col)
# match_column_name = swapper.iloc[0:row_length, match_column] 
# match_index=[i for i in match_column_name]

# swap_column=swapper.columns.get_loc(swap_col)
# swap_column_name = swapper.iloc[0:row_length, swap_column]
# swap_index=[s for s in swap_column_name] 

# #-----------Compare and swap -----------------
# for item in range(0, column_length):
# 	for loc in range(0, row_length):
# 		if match_index[loc] == toSwap.columns[item]:
# 			toSwap.rename(columns={toSwap.columns[item]: swap_index[loc]}, inplace=True)

# #print(toSwap.columns)
# dft = toSwap 
# dft.to_csv(out_file, sep='\t')
# print("Done :)")
