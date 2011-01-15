import copy

N = 9

def squ(x, y):
	return x // 3 * 3 + y // 3
	
def Print(puzzle):
	print '     0 1 2   3 4 5   6 7 8'
	print '  ||=======================||'
	for x in range(N):
		if x and x % 3 == 0:
			print '  ||-----------------------||'
		print '%d ||' % x,
		for y in range(N):
			if y and y % 3 == 0:
				print '|',
			print puzzle[x][y] if puzzle[x][y] else '_',
		print '||'
	print '  ||=======================||'

def PrintPossible(possible):
	for i in range(N):
		for j in range(N):
			print '(%d, %d)' % (i, j), possible[i][j]
	

c = 0
class Sudoku:
	def __init__(self):
		self.puzzle = [[0] * N for i in range(N)]
		self.possible = [[range(1, N + 1) for j in range(N)] for i in range(N)]
		self.step = [[0] * N for i in range(N)]
		
		self.solution = None
		self.debug = False
	
	def setValue(self, x, y, value, step = 0):
		global c
		c += 1
		
		if value in self.possible[x][y]:
			self.puzzle[x][y] = value
			self.possible[x][y] = []
			self.step[x][y] = step
		else:
			return False
		
		self.puzzle[x][y] = value
		for j in range(N):
			possible = self.possible[x][j]
			if value in possible:
				possible.remove(value)
				if not possible:
					return False
		
		for i in range(N):
			possible = self.possible[i][y]
			if value in possible:
				possible.remove(value)
				if not possible:
					return False
		
		sx = x // 3 * 3
		sy = y // 3 * 3
		for i in range(sx, sx + 3):
			for j in range(sy, sy + 3):
				possible = self.possible[i][j]
				if value in possible:
					possible.remove(value)
					if not possible:
						return False
		
		for i in range(N):
			for j in range(N):
				possible = self.possible[i][j]
				if len(possible) == 1:
					if not self.setValue(i, j, possible[0], step):
						return False
		
		return True
	
	def do(self, x, y, step):
		result = False
		
		while not self.possible[x][y]:
			if x == N - 1 and y == N - 1:
				# succeed to find one solution and exit
				Print(self.puzzle)
				
				self.solution = copy.deepcopy(self.puzzle)
				result = True
				break
			else:
				y += 1
				if y >= N:
					x += 1
					y = 0
		else:
			# backup possible
			backupPossible = [[None] * N for i in range(N)]
			for i in range(N):
				for j in range(N):
					backupPossible[i][j] = copy.copy(self.possible[i][j])
			
			for value in backupPossible[x][y]:
				if self.setValue(x, y, value, step = step):
					result = result or self.do(x, y, step + 1)
				
				for i in range(N):
					for j in range(N):
						# restore possible for the whole puzzle
						self.possible[i][j] = copy.copy(backupPossible[i][j])
						# restore the values for the step, avoiding to backup puzzle
						if self.step[i][j] == step:
							self.step[i][j] = 0
							self.puzzle[i][j] = 0
				
				if result:
					break
				
		return result
	
	def resolve(self):
		self.do(0, 0, 1)


if __name__ == '__main__':
	mySudoku = Sudoku()
	
	puzzle = mySudoku.puzzle
	#mySudoku.setValue(0, 0, 1)
	"""
	print mySudoku.setValue(0, 3, 7)
	print mySudoku.setValue(0, 5, 9)
	print mySudoku.setValue(0, 8, 1)
	print mySudoku.setValue(1, 0, 9)
	print mySudoku.setValue(1, 1, 1)
	print mySudoku.setValue(1, 5, 6)
	print mySudoku.setValue(1, 6, 8)
	print mySudoku.setValue(1, 8, 3)
	print mySudoku.setValue(2, 1, 6)
	print mySudoku.setValue(2, 5, 3)
	print mySudoku.setValue(2, 7, 4)
	print mySudoku.setValue(2, 8, 9)
	
	print mySudoku.setValue(3, 1, 9)
	print mySudoku.setValue(3, 4, 4)
	print mySudoku.setValue(3, 7, 5)
	print mySudoku.setValue(3, 8, 7)
	print mySudoku.setValue(4, 1, 5)
	print mySudoku.setValue(4, 2, 2)
	print mySudoku.setValue(4, 6, 4)
	print mySudoku.setValue(4, 7, 1)
	print mySudoku.setValue(5, 0, 3)
	print mySudoku.setValue(5, 1, 7)
	print mySudoku.setValue(5, 4, 6)
	print mySudoku.setValue(5, 7, 8)
	
	print mySudoku.setValue(6, 0, 6)
	print mySudoku.setValue(6, 1, 4)
	print mySudoku.setValue(6, 3, 3)
	print mySudoku.setValue(6, 7, 7)
	print mySudoku.setValue(7, 0, 2)
	print mySudoku.setValue(7, 2, 9)
	print mySudoku.setValue(7, 3, 5)
	print mySudoku.setValue(7, 7, 3)
	print mySudoku.setValue(7, 8, 4)
	print mySudoku.setValue(8, 0, 7)
	print mySudoku.setValue(8, 3, 6)
	print mySudoku.setValue(8, 5, 4)
	"""
	
	mySudoku.setValue(0, 0, 8)
	mySudoku.setValue(0, 1, 6)
	mySudoku.setValue(0, 4, 2)
	mySudoku.setValue(1, 3, 7)
	mySudoku.setValue(1, 7, 5)
	mySudoku.setValue(1, 8, 9)
	mySudoku.setValue(3, 4, 6)
	mySudoku.setValue(3, 6, 8)
	mySudoku.setValue(4, 1, 4)
	mySudoku.setValue(5, 2, 5)
	mySudoku.setValue(5, 3, 3)
	mySudoku.setValue(5, 8, 7)
	mySudoku.setValue(7, 1, 2)
	mySudoku.setValue(7, 6, 6)
	mySudoku.setValue(8, 2, 7)
	mySudoku.setValue(8, 3, 5)
	mySudoku.setValue(8, 5, 9)
	
	mySudoku.resolve()
	
	print 'puzzle'
	Print(mySudoku.puzzle)
	"""
	for i in range(N):
		for j in range(N):
			print '(%d, %d)' % (i, j), mySudoku.possible[i][j]
	"""
	print c
	if mySudoku.solution:
		print 'one of solutions:'
		Print(mySudoku.solution)
	else:
		print 'no solution'
	
	print 'press enter to end'
	raw_input()