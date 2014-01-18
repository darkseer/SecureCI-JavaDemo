class hangman {
  package {
    "hangman":
      ensure=>latest,
      require=>Package["tomcat"],
      notify=>Service["tomcat"]
  }  
}