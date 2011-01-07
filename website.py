import web
from sudoku import *

urls = (
		r'/',			'index',
		r'/replace/',	'replace'
)

g = globals()
app = web.application(urls, globals())
render = web.template.render('templates', globals = g, base = 'base')
gridrender = web.template.render('templates', globals = g)
g['N'] = N
g['squ'] = squ
g['gridrender'] = gridrender

class index:
	"""The index page: shows main page of sudoku"""
	def GET(self):
		"""displays a page to input a sudoku puzzle"""
		return render.input()
	
	def POST(self):
		"""displays a page to output the the sudoku solution"""
		data = web.input()
		
		mySudoku = Sudoku()
		puzzle = mySudoku.puzzle
		for i in range(N):
			for j in range(N):
				value = data.get('(%d,%d)' % (i, j), None)
				value = int(value) if value else 0
				
				puzzle[i][j].value = value
				puzzle[i][j].const = (value != 0)
				
		mySudoku.initialize()
		mySudoku.resolve()
		web.debug(mySudoku.solution)
		return render.output(puzzle)

class replace:
	"""The replace page: do the map(replace) function by Javascript"""
	def GET(self):
		return render.replace()

if __name__ == '__main__':
	app.run()

