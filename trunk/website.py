import web

urls = (
		'/', 'index'
)

app = web.application(urls, globals())
render = web.template.render('templates', base = "base")

class index:
	"""The index page: show main page of sudoku"""
	def GET(self):
		return render.input()
	
	def POST(self):
		data = web.input()
		
		result = {}
		for i in range(1, 9):
			for j in range(1, 9):
				result[(i, j)] = data.get("(%d,%d)" % (i, j), 0)
		
		#resovle(result)
		
		return render.output(result)

if __name__ == "__main__":
	app.run()
