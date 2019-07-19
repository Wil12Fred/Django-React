from rest_framework import serializers
from pago.models import Pago, Entidad, Suministro, Servicio, Tarjeta, ReturnSuministro

class EntidadSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Entidad
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Servicio
        fields = '__all__'

class SuministroSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Suministro
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Pago
        fields = '__all__'

class TarjetaSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Tarjeta
        fields = '__all__'

class ReturnSuministroSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = ReturnSuministro
        fields = '__all__'



