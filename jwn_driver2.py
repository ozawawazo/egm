import sys
fin1 = "sample.txt"
fin2 = "sample.txt"
fout = "test_out.txt"
 
import sim2
print "start";
wordLists = [
  [line.strip("\r\n").strip("\n").decode('utf-8') for line in open(fin1)],
  [line.strip("\r\n").strip("\n").decode('utf-8') for line in open(fin2)]
]
print "wordLists done";
synLists = sim2.convWords2Synsets(wordLists[0], wordLists[1])
print "synLists done";
simMatrix = sim2.calcSim(synLists[0], synLists[1])
print "simMatrix done";
sim2.writeSim(wordLists[0],wordLists[1],simMatrix,fout)
