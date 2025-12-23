export const AOP_STATUS = {
    SUBMITTED: 2,
    APPROVED: 4
}

export const isAopDisabled = (status) =>
    status === AOP_STATUS.SUBMITTED || status === AOP_STATUS.APPROVED;