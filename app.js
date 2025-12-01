$(function() {

  const maxUsers = 30
  let idCounter = 1
//// buttons prev & next
  $("button").eq(1).on("click", function () {
    idCounter++
    if (idCounter > maxUsers) idCounter = 1
    loadUser(idCounter)
    })

  $("button").eq(0).on("click", function () {
    idCounter--
    if (idCounter < 1) idCounter = maxUsers
    loadUser(idCounter)
  })

  $(".posts h3").text("Posts")
  $(".posts h3").on("click", function () {
    $(this).next("ul").toggle()
  })

  $(".todos h3").text("To Dos")
  $(".todos h3").on("click", function () {
    $(this).next("ul").toggle()
  })


  loadUser(idCounter)
  function loadUser(idCounter){
    userName(idCounter)
    userPost(idCounter)
    userTodos(idCounter)
  }


//// Users info
  function userName(idCounter) {
    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}`,
      method: "GET",
      success: function (user) {
        userNameInput(user)
      },
      error: function (err) {
        console.error(err)
      }
    })
  }

  function userNameInput(user) {
    const fullName = `${user.firstName} ${user.lastName}`
    $(".info__image img")
    .attr("src", user.image || "")
    .attr("alt", fullName)

    $(".info__content").html(
      `
      <h2>${fullName}</h2>
      <p>Age: ${user.age}</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      `
    )
    $(".posts h3").text(`${user.firstName}'s Posts`)
    $(".todos h3").text(`${user.firstName}'s To Dos`)
  }



/////   Users posts
  function userPost(idCounter) {
    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}/posts`,
      method: "GET",
      success: function (data) {
        userPostInput(data.posts)
      },
      error: function (err) {
        console.error(err)
      }
    })
  }

  function userPostInput(posts) {
    const userPosts = $(".posts ul")
    userPosts.empty()

    if (posts.length === 0) {
      userPosts.append("User has no posts")
      return
    }

    posts.forEach(post => {
      const postsText = $(`
        <li class="posts-item" data-post-id="${post.id}">
        <p class="post-title"><strong><u>${post.title}</u></strong></p>
        <p class="post-body">${post.body}</p>
        </li>
        `)
        userPosts.append(postsText)
    })
  }


///// Users To Dos
  function userTodos(idCounter) {
    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}/todos`,
      method: "GET",
      success: function (data) {
        userTodosInput(data)
      },
      error: function (err) {
        console.error(err)
      }
    })
  }

  function userTodosInput(data) {
    const toDosList = $(".todos ul")
    toDosList.empty()

    const todos = data.todos

    if (todos.length === 0) {
      toDosList.append("User has no todos")
      return
    }
    
    todos.forEach(todo => {
      toDosList.append(`<li>${todo.todo}</li>`)
    })
  }



//////// Posts Modal

  $("body").on("click", ".post-title", function () {
    const modalPost = $(this).parent(".posts-item").data("postId")

    $.ajax({
        url: `https://dummyjson.com/posts/${modalPost}`,
        method: "GET",
        success: function (post) {
          userModalPost(post)
        },
        error: function (err) {
          console.error(err)
        }
      })

      function userModalPost(post) {
        $(".modal-overlay").remove()

        const modal = $(`
        <div class="modal-overlay">
          <div class="modal">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p><strong>Views: ${post.views}</strong></p>
            <button class="close-modal">Close Modal</button>
          </div>
        </div>
        `)
        $("body").append(modal)
      }
      $("body").on("click", ".close-modal", function () {
        $(this).parent("div").parent("div").remove()
      })
  })

})