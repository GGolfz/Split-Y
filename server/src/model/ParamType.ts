import { t } from "elysia";

const GroupIdParamType = t.Object({
  groupId: t.String(),
});

const GroupIdWithExpenseIdParamType = t.Object({
  groupId: t.String(),
  expenseId: t.String(),
});
export { GroupIdParamType, GroupIdWithExpenseIdParamType };
