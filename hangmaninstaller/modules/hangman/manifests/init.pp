class hangman {
  require tomcat
  package {
    "hangman":
      ensure=>latest,
      require=>Class["tomcat"],
      notify=>Package["tomcat"]
  }  
}