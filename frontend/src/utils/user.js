export const getDefaultPanelPath = user => {
    const firstRole = user?.user_roles?.find(
        role => role.is_access && role.is_active
    );

    console.log(firstRole);

    if (firstRole) {
        return "/panel";
    }

    return `/panel/${firstRole.name}/dashboard`;
};

export const getActiveRole = (user, role) => {
    const userRole = user?.roles?.find(
        userRole => userRole.name == role
    );

    return {
        roleTitle: userRole?.title,
        isExist: !!userRole,
        isPossibility: !!(userRole?.is_access && userRole?.is_active),
        isAccess: !!userRole?.is_access,
        isActive: !!userRole?.is_active,
    };
}