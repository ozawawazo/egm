import codecs

def convWords2Synsets(wordList1, wordList2):
  import jwn_corpusreader
  jwn = jwn_corpusreader.JapaneseWordNetCorpusReader('/home/ozawa/nltk_data/corpora/wordnet', '/home/ozawa/public_html/final/pythontest/wnjpn-ok.tab/wnjpn-ok.tab')
  synLists = [[ ],[ ]]
  wordLists = [wordList1, wordList2]
  for i in [0,1]:
    print i;
    for j in range(len(wordLists[i])):
      synLists[i].append(jwn.synsets(wordLists[i][j]))
  return synLists
 
def calcSim(synList1,synList2):
  import numpy as np
  simMatrix = np.zeros( (len(synList1), len(synList2)))
  count = 1
  for i in range(len(synList1)):
    print i;
    for j in range(len(synList2)):
      if j < count:
        continue
      sims = [ ]
      for syn1 in synList1[i]:
        for syn2 in synList2[j]:
          sims.append(syn1.path_similarity(syn2))
      if synList1[i] and synList2[j]:
        simMatrix[i,j] = max(sims)
    count = count +1
  return simMatrix
 
def writeSim(wordList1, wordList2, simMatrix,fout):
  f = open(fout,"w")
#  f.write('word1,word2,similality\n')
  count = 1
  for i in range(len(wordList1)):
    for j in range(len(wordList2)):
      if j < count:
        continue
      if simMatrix[i][j] < 0.51:
        continue
      if str(simMatrix[i][j]) == str("nan"):
        continue
      f.write(wordList1[i].encode('utf-8')+ ":[" + wordList2[j].encode('utf-8') +":" + str(simMatrix[i][j])+"]\n")
    count = count + 1
