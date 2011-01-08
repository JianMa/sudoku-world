import copy

class Location:
	def __init__(self, x, y):
		self.x = x
		self.y = y
	
class Cell:
	def __init__(self):
		self.value = 0
		self.const = False

N = 9

def next(loc):
	result = Location(loc.x, loc.y)
	
	result.y += 1
	if result.y >= N:
		result.x += 1
		result.y = 0
	
	return result if result.x < N else None
	
def squ(x, y):
	return x / 3 * 3 + y / 3

def Print(result):
	print '||=======================||'
	for x in range(N):
		if x and x % 3 == 0:
			print '||-----------------------||'
		print '||',
		for y in range(N):
			if y and y % 3 == 0:
				print '|',
			print result[x][y].value if result[x][y].value else '_',
		print '||'
	print '||=======================||'

class Sudoku:
	def __init__(self):
		self.puzzle = [[Cell() for j in range(N)] for i in range(N)]
		self.solutions = []
		self.row = [set() for i in range(N)]
		self.col = [set() for i in range(N)]
		self.square = [set() for i in range(N)]
		
	def isValid(self, x, y, i):
		return (i not in self.row[x]) and (i not in self.col[y]) and (i not in self.square[squ(x, y)])
		
	def addConstrains(self, x, y, value):
		self.row[x].add(value)
		self.col[y].add(value)
		self.square[squ(x, y)].add(value)
		
	def removeConstrains(self, x, y, value):
		self.row[x].remove(value)
		self.col[y].remove(value)
		self.square[squ(x, y)].remove(value)
		
	def do(self, loc):
		if loc:
			x = loc.x
			y = loc.y
			nextLoc = next(loc)
			
			if self.puzzle[x][y].const:
				self.do(nextLoc)
			else:
				for value in range(1, N + 1):
					if self.isValid(x, y, value):
						self.puzzle[x][y].value = value
						self.addConstrains(x, y, value)
						self.do(nextLoc)
						self.puzzle[x][y].value = 0
						self.removeConstrains(x, y, value)
		else:
			Print(self.puzzle)
			self.solutions.append(copy.deepcopy(self.puzzle))
		
	def initialize(self):
		for i in range(N):
			for j in range(N):
				if self.puzzle[i][j].const:
					self.addConstrains(i, j, self.puzzle[i][j].value)
		
	def resolve(self):
		self.do(Location(0, 0))


# test
if __name__ == '__main__':
	mySudoku = Sudoku()
	puzzle = mySudoku.puzzle
	
	puzzle[0][0].value = 8
	puzzle[0][1].value = 6
	puzzle[0][4].value = 2
	puzzle[1][3].value = 7
	puzzle[1][7].value = 5
	puzzle[1][8].value = 9
	puzzle[3][4].value = 6
	puzzle[3][6].value = 8
	puzzle[4][1].value = 4
	puzzle[5][2].value = 5
	puzzle[5][3].value = 3
	puzzle[5][8].value = 7
	puzzle[7][1].value = 2
	puzzle[7][6].value = 6
	puzzle[8][2].value = 7
	puzzle[8][3].value = 5
	puzzle[8][5].value = 9
	
	puzzle[0][0].const = True
	puzzle[0][1].const = True
	puzzle[0][4].const = True
	puzzle[1][3].const = True
	puzzle[1][7].const = True
	puzzle[1][8].const = True
	puzzle[3][4].const = True
	puzzle[3][6].const = True
	puzzle[4][1].const = True
	puzzle[5][2].const = True
	puzzle[5][3].const = True
	puzzle[5][8].const = True
	puzzle[7][1].const = True
	puzzle[7][6].const = True
	puzzle[8][2].const = True
	puzzle[8][3].const = True
	puzzle[8][5].const = True
	
	mySudoku.initialize()
	mySudoku.resolve()
	
	print 'puzzle'
	Print(mySudoku.puzzle)
	
	print 'all solutions:'
	for solution in mySudoku.solutions:
		Print(solution)
	print 'press enter to end'
	raw_input()