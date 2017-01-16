module DeviseTokenAuth
  class TokenValidationsController < DeviseTokenAuth::ApplicationController
    skip_before_action :assert_is_devise_resource!, :only => [:validate_token]
    before_action :set_user_by_token, :only => [:validate_token]

    def validate_token
      # @resource will have been set by set_user_token concern
      if @resource
        yield @resource if block_given?
        render_validate_token_success
      else
        render_validate_token_error
      end
    end

    protected

    def render_validate_token_success
      render json: success(@resource.token_validation_response), status: :ok
    end

    def render_validate_token_error
      render json: unauthorize_error(I18n.t("devise_token_auth.token_validations.invalid")), status: 401
    end
  end
end
