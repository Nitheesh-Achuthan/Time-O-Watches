<td>
    
    <a href="/update?id=<%= users[i]._id %>" class="btn border-shadow update">
        <i class="fa-solid fa-pencil"></i>
    </a>
    <div>
    <form action="/delete/<%= users[i]._id %>?_method=DELETE" method="post">
    <a href="" onclick="return confirm('Are yoy want to delete <%=users[i].name %> ?')">
        <button class="btn border-shadow update" type="submit">
            
            <i class="fa-solid fa-trash-can"></i>
    </button>
    </a>
        
    </form>
</div>
    
</td>