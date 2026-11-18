from pydantic import BaseModel, model_validator


class BaseSchemaCreate(BaseModel):

    @model_validator(mode="before")
    @classmethod
    def empty_strings_to_none(cls, values):

        if isinstance(values, dict):
            values = values.copy()

            for key, value in values.items():
                if isinstance(value, str) and not value.strip():
                    values[key] = None

        return values
