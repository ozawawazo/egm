from nltk.corpus.reader.wordnet import WordNetCorpusReader
class JapaneseWordNetCorpusReader(WordNetCorpusReader):
    def __init__(self, root, filename):
        WordNetCorpusReader.__init__(self, root)
        import codecs
        f=codecs.open(filename, encoding="utf-8")
        self._jword2offset = {}
        for line in f:
            _cells = line.strip().split('\t')
            _offset_pos = _cells[0]
            _word = _cells[1]
            if len(_cells)>2: _tag = _cells[2]
            _offset, _pos = _offset_pos.split('-')
            try:
              self._jword2offset[_word].append({'offset': int(_offset), 'pos': _pos})
            except:
              self._jword2offset[_word]=[{'offset': int(_offset), 'pos': _pos}]

    def synsets(self, word):
#        results = [[ ], [ ]]
        if word in self._jword2offset:
            results = [ ]
            for offset in (self._jword2offset[word]):
                results.append(WordNetCorpusReader._synset_from_pos_and_offset(
                self, offset['pos'], offset['offset']
                ))
            return results
        else:
            return []
