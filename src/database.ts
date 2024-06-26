import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Guild Functions
export const createGuild = async (
    guildId: string,
    guildName: string,
    guildOwnerId: string,
) => {
    return await db.guild.upsert({
        where: {
            id: guildId,
        },
        update: {},
        create: {
            id: guildId,
            name: guildName,
            ownerId: guildOwnerId,
        },
        include: {
            exemptRoles: true,
            exemptChannels: true,
        },
    });
};

export const getGuild = async (guildId: string) => {
    return await db.guild.findUnique({
        where: {
            id: guildId,
        },
        include: {
            exemptRoles: true,
            exemptChannels: true,
        },
    });
};

export const getGuilds = async () => {
    return await db.guild.findMany();
};

export const deleteGuild = async (guildId: string) => {
    return await db.guild.delete({
        where: {
            id: guildId,
        },
    });
};

// Set Config Functions
export const setLogChannel = async (guildId: string, channelId: string) => {
    await db.guild.upsert({
        where: {
            id: guildId,
        },
        update: {
            logChannelId: channelId,
        },
        create: {
            id: guildId,
            logChannelId: channelId,
        },
    });
};

export const setNotifyUserPostDelete = async (
    guildId: string,
    value: boolean,
) => {
    await db.guild.upsert({
        where: {
            id: guildId,
        },
        update: {
            notifyUserPostDelete: value,
        },
        create: {
            id: guildId,
            notifyUserPostDelete: value,
        },
    });
};

export const addExemptRole = async (guildId: string, roleId: string) => {
    await db.exemptRole.upsert({
        where: {
            roleId_guildId: {
                roleId,
                guildId,
            },
        },
        update: {},
        create: {
            guildId,
            roleId,
        },
    });
};

export const addExemptRoleBulk = async (guildId: string, roleIds: string[]) => {
    try {
        await db.exemptRole.createMany({
            data: roleIds.map((roleId) => ({
                guildId,
                roleId,
            })),
        });
    }
    catch (e) {
        await Promise.all(
            roleIds.map(async (roleId) => {
                await db.exemptRole.upsert({
                    where: {
                        roleId_guildId: {
                            guildId,
                            roleId,
                        },
                    },
                    update: {},
                    create: {
                        guildId,
                        roleId,
                    },
                });
            }),
        );
    }
};

export const checkIfExemptRole = async (guildId: string, roleId: string) => {
    return await db.exemptRole.findFirst({
        where: {
            guildId,
            roleId,
        },
    });
};

export const removeExemptRole = async (guildId: string, roleId: string) => {
    await db.exemptRole.delete({
        where: {
            roleId_guildId: {
                roleId,
                guildId,
            },
        },
    });
};

export const getExemptRoles = async (guildId: string) => {
    return await db.exemptRole.findMany({
        where: {
            guildId: guildId,
        },
    });
};

export const addExemptChannel = async (guildId: string, channelId: string) => {
    await db.exemptChannel.upsert({
        where: {
            channelId_guildId: {
                guildId,
                channelId,
            },
        },
        update: {}, create: {
            guildId,
            channelId,
        },
    });
};

export const addExemptChannelBulk = async (
    guildId: string,
    channelIds: string[],
) => {
    try {
        await db.exemptChannel.createMany({
            data: channelIds.map((channelId) => ({
                guildId,
                channelId,
            })),
        });
    }
    catch (e) {
        await Promise.all(
            channelIds.map(async (channelId) => {
                await db.exemptChannel.upsert({
                    where: {
                        channelId_guildId: {
                            guildId,
                            channelId,
                        },
                    },
                    update: {},
                    create: {
                        guildId,
                        channelId,
                    },
                });
            }),
        );
    }
};

export const checkIfExemptChannel = async (
    guildId: string,
    channelId: string,
) => {
    return await db.exemptChannel.findFirst({
        where: {
            guildId: guildId,
            channelId: channelId,
        },
    });
};

export const removeExemptChannel = async (
    guildId: string,
    channelId: string,
) => {
    await db.exemptChannel.delete({
        where: {
            channelId_guildId: {
                channelId,
                guildId,
            },
        },
    });
};

export const getExemptChannels = async (guildId: string) => {
    return await db.exemptChannel.findMany({
        where: {
            guildId: guildId,
        },
    });
};

export const setNotifyUserPostDeleteMessage = async (
    guildId: string,
    message: string,
) => {
    await db.guild.upsert({
        where: {
            id: guildId,
        },
        update: {
            notifyUserPostDeleteMessage: message,
        },
        create: {
            id: guildId,
            notifyUserPostDeleteMessage: message,
        },
    });
};
