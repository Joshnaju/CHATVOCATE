from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rag.vector_store import retrieve_context

from .serializers import ChatSerializer
from rag.rag_pipeline import generate_answer

class ChatView(APIView):

    def post(self, request):
        serializer = ChatSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        question = serializer.validated_data["question"]
        chat_history = request.data.get("chat_history", [])

        try:
            # Retrieve relevant context
            context = retrieve_context(question)
            # print(context)
            # Generate answer
            answer = generate_answer(
                context,
                question,
                chat_history
            )

            # Return only the answer
            return Response(
                {"answer": answer},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("Chat error:", str(e))

            return Response(
                {"error": "Unable to process your question."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )