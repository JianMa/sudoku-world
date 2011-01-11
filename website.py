import web
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
g['N'] = N
g['squ'] = squ
g['gridrender'] = gridrender


class index:
	"""The index page: main page shows the links to all the functionality"""
	def GET(self):
		web.debug("why?")
		return render.index()

class solve:
	"""The solve page: shows a page to solve sudoku in a fast way"""
	def GET(self):
		"""displays a page to input a sudoku puzzle"""
		return render.input()
	
	def POST(self):
		"""displays a page to output the the sudoku solutions"""
		data = web.input()
		
		mySudoku = Sudoku()
		for (i, j) in [(i, j) for i in range(N) for j in range(N)]:
			value = data.get('p%d%d' % (i, j), None)
			value = int(value) if value else 0
			if value and not mySudoku.setValue(i, j, value):
				break
		else:
			mySudoku.resolve()
		
		return render.output(mySudoku.solution)

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

