class apache {
  package{
    "httpd":
      ensure => "latest"
  }
  file {
    "/etc/httpd/conf.d/proxy_ajp.conf":
      content => template("apache/proxy_ajp.conf.erb"),
      require => Package["httpd"],
      notify=>Service["httpd"]
  }
  service {
    "httpd":
      enable=>true,
      ensure=>running
  }
}