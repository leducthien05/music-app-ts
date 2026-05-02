//Permission
const tablePermission = document.querySelector("#permission");
const tableRole = document.querySelector(".role-table");
if (tablePermission && tableRole) {
    const btnSubmit = document.querySelector("[button-submit]");
    const rolePermission = {
        permission: []
    };
    btnSubmit.addEventListener("click", (e) => {
        const inputRole = tableRole.querySelectorAll("input[name='role_id']");
        inputRole.forEach(item => {
            const checked = item.checked;
            if (checked == true) {
                rolePermission.role_id = item.value;
            }
        });
        const inputPermission = tablePermission.querySelectorAll("input");
        inputPermission.forEach(item => {
            const checked = item.checked;
            if (checked == true) {
                rolePermission.permission.push(item.value);
            }
        });
        console.log(rolePermission)
        const formPermission = document.querySelector("#form-permission");
        const input = formPermission.querySelector("input[name='permission']");
        input.value = JSON.stringify(rolePermission);
        formPermission.submit();
    });
}

// In quyền ra giao diện
const roleInputs = document.querySelectorAll("input[name='role_id']");
const permissionInputs = document.querySelectorAll("#permission input");
const roles = JSON.parse(document.querySelector("[data-role]").getAttribute("data-role"));
roleInputs.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.checked) {
            // reset tất cả permission
            permissionInputs.forEach(item =>{
                item.checked = false;
            });
            // tìm role tương ứng
            const role = roles.find(item =>{
                return item._id === radio.value
            });
            if (role) {
                permissionInputs.forEach(item => {
                    if (role.permission.includes(item.value)) {
                        item.checked = true;
                    }
                });
            }
        }
    });
});