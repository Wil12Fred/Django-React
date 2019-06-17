from library.models import Publisher, Author, Book
from library.serializers import PublisherSerializer, AuthorSerializer, BookSerializer
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import mixins

class PublisherListCreate(generics.ListCreateAPIView):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer

class AuthorListCreate(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorDetailView(generics.RetrieveAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

@api_view(["GET", "PUT"])
def author_update(request, pk):
    author = Author.objects.get(id=pk)
    if request.method == "PUT":
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({"error": serializer.errors, "error": True}) 
    serializer = AuthorSerializer(author)
    return Response(serializer.data)

@api_view(["GET"])
def author_detail(request, pk):
    author = Author.objects.get(id=pk)
    serializer = AuthorSerializer(author)
    return Response(serializer.data)

def delete_author(request, pk):
    author = get_object_or_404(Author, id=pk)
    author.delete()
    return Response({"message": "Deleted"})

@api_view(["GET", "PUT"])
def book_update(request, pk):
    book = Book.objects.get(id=pk)
    if request.method == "PUT":
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response({"error": serializer.errors, "error": True}) 
    serializer = BookSerializer(book)
    return Response(serializer.data)

@api_view(["GET"])
def book_detail(request, pk):
    book = Book.objects.get(id=pk)
    serializer = BookSerializer(book)
    return Response(serializer.data)

def delete_book(request, pk):
    book = get_object_or_404(Book, id=pk)
    book.delete()
    return Response({"message": "Deleted"})
