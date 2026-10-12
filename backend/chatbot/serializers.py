from rest_framework import serializers

class ChatSerializer(serializers.Serializer):
    question = serializers.CharField(
        required=True,
        max_length=2000,
        trim_whitespace=True
    )

    def validate_question(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Question cannot be empty."
            )

        return value