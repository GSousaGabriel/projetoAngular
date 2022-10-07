from django.shortcuts import render
from django.views.generic import View

class FrontView(View):
    def get(self,request):
        return render(request, "C:/Users/gabriel.gs/Documents/curso-angular/primeiroProj/src/app/cursos/cursos.component.html", {})
    