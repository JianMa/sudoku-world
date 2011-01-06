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
	print "------------------------"
	for x in range(N):
		for y in range(N):
			print result[x][y].value,
		print
	print "------------------------"

class Sudoku:
	def __init__(self):
		self.puzzle = [[Cell() for j in range(N)] for i in range(N)]
		self.solution = []
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
			Print(self.puzzle)
			for value in range(1, N + 1):
				if self.puzzle[x][y].const:
					self.do(nextLoc)
				elif self.isValid(x, y, value):
					self.puzzle[x][y].value = value
					self.addConstrains(x, y, value)
					self.do(nextLoc)
					self.puzzle[x][y].value = 0
					self.removeConstrains(x, y, value)
		else:
			print("OK")
			exit()
			self.solution.append(deepcopy(puzzle))
		
	def initialize(self):
		for i in range(N):
			for j in range(N):
				if self.puzzle[i][j].const:
					self.addConstrains(i, j, self.puzzle[i][j].value)
		
	def resolve(self):
		self.do(Location(0, 0))

