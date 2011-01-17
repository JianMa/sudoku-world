import web
import time

from sudoku import *

urls = (
		r'/',			'index',
		r'/solve/',		'solve',
		r'/replace/',	'replace',
		r'/demo/',		'demo'
)

g = globals()
app = web.application(urls, globals())
render = web.template.render('templates', globals = g, base = 'base')
gridrender = web.template.render('templates', globals = g, builtins = __builtins__)
g['GridN'] = GridN
g['squ'] = squ
g['gridrender'] = gridrender


class index:
	"""The index page: main page shows the links to all the functionality"""
	def GET(self):
		return render.index()

class solve:
	"""The solve page: shows a page to solve sudoku in a fast way"""
	def GET(self):
		"""displays a page to input a sudoku puzzle"""
		return render.solve_input()
	
	def POST(self):
		"""displays a page to output the the sudoku solutions"""
		data = web.input()
		
		startTime = time.time()
		
		mySudoku = Sudoku()
		for (i, j) in [(i, j) for i in range(GridN) for j in range(GridN)]:
			value = data.get('p%d%d' % (i, j), None)
			value = int(value) if value else 0
			if value and not mySudoku.setValue(i, j, value):
				break
		else:
			mySudoku.resolve()
		
		endTime = time.time()
				
		return render.solve_output(mySudoku.puzzle, mySudoku.solution, (endTime - startTime) * 1000)

class replace:
	"""The replace page: do the map(replace) function by Javascript"""
	def GET(self):
		return render.replace()

class demo:
	"""The demo page: show how to solve a sudoku puzzle step by step using brute-force method"""
	def GET(self):
		return render.demo()

if __name__ == '__main__':
	app.run()
