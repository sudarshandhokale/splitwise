Paperclip::Attachment.default_options[:url] = '/system/:attachment/:id/:style/:filename'
Paperclip::Attachment.default_options[:path] = ':rails_root/public/system/:attachment/:id/:style/:filename'
Paperclip::Attachment.default_options[:s3_host_name] = 's3-us-west-2.amazonaws.com'