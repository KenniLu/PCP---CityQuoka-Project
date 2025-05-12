output "name_servers" {
  value = aws_route53_zone.main.name_servers
  description = "Name servers to configure at your domain registrar"
}

output "zone_id" {
  value = aws_route53_zone.main.zone_id
  description = "Route 53 zone ID for future use"
}