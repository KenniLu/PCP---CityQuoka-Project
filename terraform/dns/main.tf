terraform {
  backend "s3" {
    bucket = "cq-cms-terraform-dns-state"
    key = "terraform/dns/state"
    region = "ap-southeast-2"
    use_lockfile = true
  }
}

# At the top of your dns/main.tf file
provider "aws" {
  region = "ap-southeast-2"
  alias  = "main"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

# Data sources to get CloudFront distributions and certificates from both environments
data "terraform_remote_state" "production" {
  backend = "s3"  # Adjust if you're using a different backend
  
  config = {
    bucket = "cq-cms-production-terraform-state"
    key    = "terraform/production/state"
    region = "ap-southeast-2"
  }
}

data "terraform_remote_state" "staging" {
  backend = "s3"  # Adjust if you're using a different backend
  
  config = {
    bucket = "cq-cms-staging-terraform-state"
    key    = "terraform/staging/state"
    region = "ap-southeast-2"
  }
}

# ------------------------------------------------------
# Route 53 Hosted Zone
# ------------------------------------------------------
resource "aws_route53_zone" "main" {
  name = "cityquokka.com"
  
  tags = {
    Project = "cityquokka"
    ManagedBy = "Terraform"
  }
}

# ------------------------------------------------------
# DNS Records for Production
# ------------------------------------------------------
# Apex domain (cityquokka.com)
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "cityquokka.com"
  type    = "A"
  
  alias {
    name                   = data.terraform_remote_state.production.outputs.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"  # Fixed ID for CloudFront distributions
    evaluate_target_health = false
  }
}

# WWW subdomain
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.cityquokka.com"
  type    = "A"
  
  alias {
    name                   = data.terraform_remote_state.production.outputs.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"  # Fixed ID for CloudFront distributions
    evaluate_target_health = false
  }
}

# ------------------------------------------------------
# DNS Records for Staging
# ------------------------------------------------------
# Staging subdomain
resource "aws_route53_record" "staging" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "staging.cityquokka.com"
  type    = "A"
  
  alias {
    name                   = data.terraform_remote_state.staging.outputs.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"  # Fixed ID for CloudFront distributions
    evaluate_target_health = false
  }
}

# ------------------------------------------------------
# Email-related DNS Records (Google Workspace + MailerSend + SES)
# ------------------------------------------------------
# Google Workspace MX Records
resource "aws_route53_record" "mx" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "cityquokka.com"  # The @ symbol in Namecheap means the apex/root domain
  type    = "MX"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "1 aspmx.l.google.com.",
    "5 alt1.aspmx.l.google.com.",
    "5 alt2.aspmx.l.google.com.",
    "10 aspmx2.googlemail.com.",
    "10 aspmx3.googlemail.com."
  ]
}

# MailerSend MX Record for inbound subdomain
resource "aws_route53_record" "mx_inbound" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "inbound.cityquokka.com"
  type    = "MX"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "10 inbound.mailersend.net."
  ]
}

# Amazon SES MX Record for mail subdomain
resource "aws_route53_record" "mx_mail" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mail.cityquokka.com"
  type    = "MX"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "10 feedback-smtp.ap-southeast-2.amazonses.com."
  ]
}

# SPF Record & Google Site Verification
resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "cityquokka.com"  # @ in Namecheap
  type    = "TXT"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "v=spf1 include:_spf.mailersend.net ~all",
    "google-site-verification=2o7NJHF9w5D15-3itZIt_VfWGXsNYI6DcRFCyClwa9M"
  ]
}

# DMARC Record
resource "aws_route53_record" "dmarc" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_dmarc.cityquokka.com"
  type    = "TXT"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "v=DMARC1; p=none;"
  ]
}

# SPF Record for mail subdomain (for SES)
resource "aws_route53_record" "mail_spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mail.cityquokka.com"
  type    = "TXT"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "v=spf1 include:amazonses.com ~all"
  ]
}

# MailerSend DKIM Record
resource "aws_route53_record" "mailersend_dkim" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mlsend2._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "mlsend2._domainkey.mailersend.net."
  ]
}

# MailerSend Email CNAME
resource "aws_route53_record" "email_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "email.cityquokka.com"
  type    = "CNAME"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "links.mailersend.net."
  ]
}

# MailerSend MTA CNAME
resource "aws_route53_record" "mta_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "mta.cityquokka.com"
  type    = "CNAME"
  ttl     = "300"             # 5 minutes = 300 seconds
  records = [
    "mailersend.net."
  ]
}

# Amazon SES DKIM Records
resource "aws_route53_record" "ses_dkim1" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "hacukdsywqqm22shsnnuo6b4y7m6frac._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "hacukdsywqqm22shsnnuo6b4y7m6frac.dkim.amazonses.com."
  ]
}

resource "aws_route53_record" "ses_dkim2" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "kqygfypn56awu7wkpnhszyaknpce5dfn._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "kqygfypn56awu7wkpnhszyaknpce5dfn.dkim.amazonses.com."
  ]
}

resource "aws_route53_record" "ses_dkim3" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "qxvspakx44rbtvff3mt6dghmke6yqsnj._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "qxvspakx44rbtvff3mt6dghmke6yqsnj.dkim.amazonses.com."
  ]
}

resource "aws_route53_record" "ses_dkim4" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "vtwnklzwfruifktmy7wwehlt7ytcmfb5._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "vtwnklzwfruifktmy7wwehlt7ytcmfb5.dkim.amazonses.com."
  ]
}

resource "aws_route53_record" "ses_dkim5" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "ywz226cyd62pbnm4wp77avofa4o7x63c._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "ywz226cyd62pbnm4wp77avofa4o7x63c.dkim.amazonses.com."
  ]
}

resource "aws_route53_record" "ses_dkim6" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "zspttug3pbn6qkilt2ag7r3dhzfzrfqk._domainkey.cityquokka.com"
  type    = "CNAME"
  ttl     = "3600"            # Automatic typically means 1 hour
  records = [
    "zspttug3pbn6qkilt2ag7r3dhzfzrfqk.dkim.amazonses.com."
  ]
}

# ------------------------------------------------------
# Certificate Validation Records
# ------------------------------------------------------
# These will be managed by the certificate validation resources below
# and replace the existing ACM validation CNAME records

# Production Certificate Validation
resource "aws_route53_record" "prod_cert_validation" {
  for_each = {
    for dvo in data.terraform_remote_state.production.outputs.certificate_domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      record  = dvo.resource_record_value
    }
  }

  name    = each.value.name
  type    = each.value.type
  zone_id = aws_route53_zone.main.zone_id
  records = [each.value.record]
  ttl     = 60
}

# Staging Certificate Validation
resource "aws_route53_record" "staging_cert_validation" {
  for_each = {
    for dvo in data.terraform_remote_state.staging.outputs.certificate_domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      record  = dvo.resource_record_value
    }
  }

  name    = each.value.name
  type    = each.value.type
  zone_id = aws_route53_zone.main.zone_id
  records = [each.value.record]
  ttl     = 60
}

# ------------------------------------------------------
# Certificate Validation Resources
# ------------------------------------------------------
# Production Certificate Validation
resource "aws_acm_certificate_validation" "prod_cert" {
  provider                = aws.us-east-1
  certificate_arn         = data.terraform_remote_state.production.outputs.certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.prod_cert_validation : record.fqdn]
}

# Staging Certificate Validation
resource "aws_acm_certificate_validation" "staging_cert" {
  provider                = aws.us-east-1
  certificate_arn         = data.terraform_remote_state.staging.outputs.certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.staging_cert_validation : record.fqdn]
}
