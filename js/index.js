var firebaseConfig = {
    apiKey: "AIzaSyBcsY211hnIfJK6lYpvD7-dj66RpQyuVww",
    authDomain: "fir-webapp-fe1d9.firebaseapp.com",
    databaseURL: "https://fir-webapp-fe1d9.firebaseio.com",
    projectId: "fir-webapp-fe1d9",
    storageBucket: "fir-webapp-fe1d9.appspot.com",
    messagingSenderId: "397492290604",
    appId: "1:397492290604:web:ca06000b43490e0b9d7d89",
    measurementId: "G-DK55N6JQMC"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);




  $('#btn-login').click(function(){
      var email = $('#email').val();
      var password = $('#password').val();
      

      if(email != "" && password != ""){
        var result = firebase.auth().signInWithEmailAndPassword(email, password);


        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            window.alert("Message : "+ errorMessage);
        });

      }else{
          window.alert("Please fill all fields.");
      }

      firebase.auth().onAuthStateChanged(function(user){
        if(user)
        {
            var userID = firebase.auth().currentUser.uid;
            firebase.database().ref('Users/' + userID).once('value').then(function(snapshot){
                if(snapshot.val()){
                    window.location.href = "MainPage.html";

                }else{
                    window.location.href = "accountSettings.html";
                }
            });
        }
    });

    
  });

  

  $("#btn-update").click(function(){
    var FirstName = $('#FirstName').val();
    var LastName = $('#SecondName').val();
    var yearofpass = $('#yearofpass').val();
    var phnnumber = $('#phnnumber').val();
    var presentorg = $('#presentorg').val();
    var desig = $('#desig').val();
    var furtheredu = $('#furtheredu').val();
    var newpass = $('#newpass').val();
    var file = $('#image').prop('files');
    
    var blob = new Blob(file, { type: "image/jpeg/png/jpg" });
    
    

    var email = firebase.auth().currentUser && firebase.auth().currentUser.email;

    var rootRef = firebase.database().ref().child("Users");
    var userID = firebase.auth().currentUser.uid;
    var usersRef = rootRef.child(userID);

    const storageRef = firebase.storage().ref();
    
    

    console.log("before triggered");
    
    if(FirstName!= ""  && LastName!= "" && presentorg != "" && desig != "" && phnnumber != "" && yearofpass !="" && newpass!=""){

        var imgurl;
        //const metadata = { contentType: 'image/jpeg' }; // or whatever you want
        
        firebase.auth().currentUser.updatePassword(newpass).then(function() {
            console.log("success");
          }).catch(function(error) {
            // An error happened.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log("Message : "+ errorMessage);
          });
          
        

        var userData= {
            "First Name":FirstName,
            "Last Name":LastName,
            "Year of Pass": yearofpass,
            "Email": email,
            "Phone Number": phnnumber,
            "Present Organisation": presentorg,
            "Designation": desig,
            "Further Education": furtheredu,
            "zzNew Password": newpass

            
        };
        

        usersRef.set(userData, function(error){
            if(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                window.alert("Message : "+ errorMessage);
                
            }
        }); 

        if(blob.size != 0){
            var filename = new Date().getTime();
            const uploadTask = storageRef.child(`images/${filename}`).put(blob);
            
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    uploadstatus.innerHTML = "Upload is paused";
                    break;
                case firebase.storage.TaskState.RUNNING:
                    uploadstatus.innerHTML = "Upload is running";
                    break;
                }
            }, error => {
                console.log(error);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    var imageuserRef = usersRef.child("zimageurl");
                    imageuserRef.set(downloadURL, function(error){
                        if(error){
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            console.log(errorCode);
                            window.alert("Message : "+ errorMessage);
                            
                        }else{
                            window.location.href = "MainPage.html";
                        }
                    });
                    
                });
            });
        }else{
            var imageuserRef = usersRef.child("zimageurl");
            blankurl = " ";
            imageuserRef.set(blankurl, function(error){
                if(error){
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    window.alert("Message : "+ errorMessage);
                    
                }else{
                    window.location.href = "MainPage.html";
                }
            });

       

    }} else{
        window.alert("Fill up all fields.");
    }
  });
  

  $("#btn-logout").click(function(){
    firebase.auth().signOut();
    console.log("signed out");
    window.location.href = "index.html";
  });


  $("#btn-submit").click(function(){
    $("#scrollbox tr:not(:first)").remove(); 
      var searchFirstName=$('#searchFirstName').val();
      var searchLastName=$('#searchSecondName').val();
      var searchyearofpass=$('#searchyearofpass').val();
      var nameyear;
      var arr;
      var i = 1;
      if((searchyearofpass != "") || (searchFirstName != "")){

        firebase.database().ref('Users').on('value',(snap)=>{
            var data = snap.val();
            for(key in data) {
                if(data.hasOwnProperty(key)) {
                    var value = data[key];
                    
                    nameyear =[Object.values(value)[2],Object.values(value)[4],Object.values(value)[7],Object.values(value)[1],Object.values(value)[6], Object.values(value)[8]];
            
              
                    if(searchFirstName.toLowerCase() === nameyear[0].toLowerCase() && searchLastName === "" && searchyearofpass === ""){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                    }
                    if(searchFirstName.toLowerCase() === nameyear[0].toLowerCase() && searchLastName.toLowerCase() === nameyear[1].toLowerCase() && searchyearofpass === ""){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                        
                    }
                    if(searchFirstName === "" && searchLastName === "" && searchyearofpass.toLowerCase() === nameyear[2].toLowerCase()){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                        
                    }
                    if(searchFirstName === "" && searchLastName === nameyear[1].toLowerCase() && searchyearofpass === nameyear[2].toLowerCase()){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                        
                    }
                    if(searchFirstName.toLowerCase() === nameyear[0].toLowerCase() && searchLastName === "" && searchyearofpass === nameyear[2].toLowerCase()){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                    }
                    if(searchFirstName.toLowerCase() === nameyear[0].toLowerCase() && searchLastName === nameyear[1].toLowerCase() && searchyearofpass === nameyear[2].toLowerCase()){
                        
                        var table = document.getElementById("scrollbox");
                        var row = table.insertRow(i);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        cell1.innerHTML = nameyear[0]+" "+nameyear[1];
                        if(nameyear[5] != " "){
                            var img = document.createElement('img');
                            img.src = nameyear[5];
                            cell5.appendChild(img);
                        }
                        cell2.innerHTML = nameyear[2];
                        cell3.innerHTML = nameyear[3];
                        cell4.innerHTML = nameyear[4];
                        i = i + 1;
                        
                        
                    }
                    
                }
            }
            
          });
        
          
      }else{
          window.alert("Enter atleast one of the starred fields.");
      }
  });

 


  

  $("#btn-internadd").click(function(){
    var joborg = $('#joborg').val();
    var jobtype = $('#jobtype').val();
    var jobdesig = $('#jobdesig').val();
    var jobconperson = $('#jobconperson').val();
    var jobconnum = $('#jobconnum').val();
    var jobmail = $('#jobmail').val();
    var joblocation = $('#joblocation').val();
    var jobcalltime = $('#jobcalltime').val();
    var email = firebase.auth().currentUser && firebase.auth().currentUser.email;


    var currentTime = new Date();

    var currentOffset = currentTime.getTimezoneOffset();

    var ISTOffset = 330;   // IST offset UTC +5:30 

    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

    // ISTTime now represents the time in IST coordinates
    var yearIST = ISTTime.getFullYear().toString();
    var monthIST = ISTTime.getMonth().toString();
    var dateIST = ISTTime.getDate().toString();
    var hoursIST = ISTTime.getHours().toString();
    var minutesIST = ISTTime.getMinutes().toString();
    var secondsIST = ISTTime.getSeconds().toString();
    time = yearIST + dateIST + hoursIST + minutesIST + secondsIST;
    date = dateIST+"/"+monthIST+"/"+yearIST;
    console.log(date);
    var rootRef = firebase.database().ref().child("Jobs");
   
    var usersRef = rootRef.child(time);

    

    var userData= {
            "Date Added" : date,
            "Organisation": joborg,
            "Employment Type":jobtype,
            "Designation": jobdesig,
            "Provider Email": email,
            "Contact Person": jobconperson,
            "Contact Number":jobconnum,
            "Mail ID": jobmail,
            "Job Location": joblocation,
            "Preferred Time of Calling": jobcalltime
    };

    usersRef.set(userData, function(error){
            if(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                window.alert("Message : "+ errorMessage);
            }
    });

  });

  $("#btn-show").click(function(){
    $("#dispbox tr:not(:first)").remove(); 
    var i = 1;  
      firebase.database().ref('Jobs').on('value',(snap)=>{var data = snap.val();
        for(key in data) {
            if(data.hasOwnProperty(key)) {
                var value = data[key];
                console.log(Object.values(value));
                records = Object.values(value);
                var table = document.getElementById("dispbox");
                var row = table.insertRow(i);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                var cell8 = row.insertCell(7);
                var cell9 = row.insertCell(8);
                cell1.innerHTML = records[2];
                cell2.innerHTML = records[7];
                cell3.innerHTML = records[4];
                cell4.innerHTML = records[3];
                cell5.innerHTML = records[1];
                cell6.innerHTML = records[0];
                cell7.innerHTML = records[6];
                cell8.innerHTML = records[5];
                cell9.innerHTML = records[8];
                i = i + 1;
            }
        }
    });
        
  });



  
