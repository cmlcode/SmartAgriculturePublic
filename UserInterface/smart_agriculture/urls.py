from django.urls import path
from . import views
from .views import CustomLoginView
urlpatterns = [
    path('', views.loginPage, name='login'),
    path('environment/',views.getRecord,name="environment"),
    path('autoconfig/',views.autoConfig,name="autoconfig"),
    path('applyconfig/',views.applyConfig,name="applyconfig"),
    path('latest/',views.getLatest,name="latest"),
    path('getplantinfo',views.getPlantinfo,name="getplantinfo"),
    # path('login/', CustomLoginView.as_view(), name='login'),
    path('getalertslast3', views.getAlertLast3,name="getalertslast3"),
    path("clear_alert",views.clear_alert,name="clear_alert"),
    path('terminate',views.terminate,name="terminate"),
    path('abort',views.abort,name="abort"),
    path('get_history',views.getHistory,name='gethistory'),
    path('get_history_page',views.findHistoryPage,name='gethistorybyid'),
    path('change_plant_state',views.changePlantState,name='gethistorybyid'),
    path('index',views.index, name='main_page'),
    path('token/check',views.TokenCheck,name="TokenCHeck"),
    path('water_pump', views.waterPump, name="waterPump"),
    path('get_irrigation',views.getIrrigation,name="getIrrigation")
]
