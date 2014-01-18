class tomcat {
  package{
    "tomcat6":
      ensure=>"latest"
  }
  file{
    "/var/lib/tomcat/conf/server.xml":
      content=>template("tomcat/server.xml.erb"),
      notify=>Service["tomcat"]
  }
  service{
    "tomcat":
      ensure=>running,
      enable=>true
  }
}