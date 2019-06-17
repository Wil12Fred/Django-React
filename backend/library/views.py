from library.models import Publisher, Author, Book
from django.db.models import Count
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

class AuthorPageView(generics.ListCreateAPIView):
    model = Author
    serializer_class = AuthorSerializer
    def get_queryset(self):
        page = int(self.request.query_params.get('page'))
        tampage = 5;
        queryset = Author.objects.annotate(first_name_count=Count('first_name')).order_by('-first_name_count')[page*tampage:(page+1)*tampage];
        return queryset

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookPageView(generics.ListCreateAPIView):
    model = Book
    serializer_class = BookSerializer
    def get_queryset(self):
        page = int(self.request.query_params.get('page'))
        tampage = 5;
        queryset = Book.objects.annotate(title_count=Count('title')).order_by('-title_count')[page*tampage:(page+1)*tampage];
        return queryset

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

def page_book(request, pk):
    book = Book.objects.annotate(Count('title')).order_by('-title_count')[:pk]
    serializer = BookSerializer(book)
    return Response(serializer.data)

