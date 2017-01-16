module JsonResponse
  extend ActiveSupport::Concern

	def success(object, message = "Successfully")
		{
    	status: 'success',
    	result: {
    		"#{get_class_name(object)}": object.as_json,
        message: message
    	}
    }
	end

  def error(object)
		{
    	status: 'error',
    	error: {
    		code: 10422,
    		message: "Validation errors for #{get_class_name(object)}",
    		errors: serialize(object.errors)
    	}
    }
	end

  def message_error(message)
    {
      status: 'error',
      error: {
        code: 10422,
        message: message
      }
    }
  end

  def message_success(message)
    {
      status: 'success',
      result: {
        message: message
      }
    }
  end

	def standard_error(object)
		{
    	status: 'error',
    	error: {
    		code: 10500,
    		message: "Internal Server Error",
    		errors: "#{object.message}"
    	}
    }
	end

  def unauthorize_error(message = "Unauthorized User")
  	{
    	status: 'error',
    	error: {
    		code: 10401,
    		message: "#{message}"
    	}
    }
  end

  def get_class_name(object)
  	if object.try(:base_class).nil?
      object.class.name.downcase
  	else
  		object.base_class.name.downcase.pluralize
  	end
  end

  def serialize(errors)
    return if errors.nil?
    json = {}
    errors.to_hash(true).map do |k, v|
      v.map do |msg|
        json[k] = msg
      end
    end
    json
  end
end
