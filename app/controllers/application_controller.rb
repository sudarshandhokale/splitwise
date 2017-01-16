class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken, JsonResponse
  protect_from_forgery with: :null_session
  before_action :configure_permitted_parameters, if: :devise_controller?
  rescue_from StandardError do |exception|
    render json: standard_error(exception), status: 500
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end
end
