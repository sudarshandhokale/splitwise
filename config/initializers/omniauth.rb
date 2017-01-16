Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1702356373352765', '0c8283ea21b161ff871721fd8e201a1b'
  provider :google_oauth2, '837824516984-4ug5d1ogbnr0pmrr79c1gkdjd4o46o33.apps.googleusercontent.com', 'WMoWzkm9Id9aUwM8nf3VFx6h'
end
