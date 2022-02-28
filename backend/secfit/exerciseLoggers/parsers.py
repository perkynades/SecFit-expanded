import json
from rest_framework import parsers

class MutlipartJsonparse(parsers.MultiPartParser):

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream, media_type=media_type, parser_context=parser_context
        )
        data = {}
        new_files = {"files": []}

        for key, value in result.data.items():
            if not isinstance(value, str):
                data[key] = value
                continue
            if "{" in value or "[" in value:
                try:
                    data[key] = json.loads(value)
                except ValueError:
                    data[key] = value
            else:
                data[key] = value
        
        files = result.files.getlist("files")
        for file in files:
            new_files["files"].append({"file": file})
        
        return parsers.DateAndFiles(data, new_files)