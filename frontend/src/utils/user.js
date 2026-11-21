export const getDefaultPanel = user => {
    const firstRole = user?.roles?.findLast(
        role => role.is_access && role.is_active
    );

    return firstRole.name;
};

export const getActiveRole = (user, role) => {
    const userRole = user?.roles?.find(
        userRole => userRole.name === role
    );

    return {
        roleTitle: userRole?.title,
        isExist: !!userRole,
        isPossibility: !!(userRole?.is_access && userRole?.is_active),
        isAccess: !!userRole?.is_access,
        isActive: !!userRole?.is_active,
    };
}