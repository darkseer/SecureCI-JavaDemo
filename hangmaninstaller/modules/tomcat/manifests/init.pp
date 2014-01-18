class tomcat {
  package{
    "tomcat6":
      ensure=>"latest"
  }
  file{
    "/etc/tomcat6/server.xml":
      content=>template("tomcat/server.xml.erb"),
      notify=>Service["tomcat"]
  }
  service{
    "tomcat6":
      ensure=>running,
      enable=>true
  }
}