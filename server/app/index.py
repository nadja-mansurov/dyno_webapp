from flask_appbuilder.baseviews import BaseView, expose
from flask import render_template
from . import appbuilder


class MyView(BaseView):
    route_base = "/"

    @expose("view/")
    def method1(self):
        template = 'index.html'
        # do something with param1
        # and return to previous page or index
        return render_template(template)

appbuilder.add_view_no_menu(MyView())