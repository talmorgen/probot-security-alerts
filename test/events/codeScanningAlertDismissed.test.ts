import { mockGitHubApiRequests, getTestableProbot, resetNetworkMonitoring } from "../utils/helpers";
import payload from "./../fixtures/code_scanning_alert/closed_by_user.json";

describe("When code scanning alerts are received", () => {
  // Use the any type to avoid issues with additional fields in the payload that Probot cannot recognize
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let probot: any;

  beforeEach(() => {
    probot = getTestableProbot();
  });

  test.each(["maintainer", "member"])(`ignores alerts closed by a %s in the approving team`, async (role: string) => {
    const mock = mockGitHubApiRequests()
      .canRetrieveAccessToken()
      .isInApprovingTeam(role)
      .toNock();

    await probot.receive({ name: "code_scanning_alert.closed_by_user", payload });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test('opens alerts closed by non-member of the approving team', async () => {
    const mock = mockGitHubApiRequests()
      .canRetrieveAccessToken()
      .isNotInApprovingTeam()
      .withAlertState("code-scanning", "open")
      .toNock();

    await probot.receive({ name: "code_scanning_alert.closed_by_user", payload });

    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("opens alerts if membership request returns a 500 error", async () => {
    const mock = mockGitHubApiRequests()
      .canRetrieveAccessToken()
      .errorRetrievingTeamMembership(500)
      .withAlertState("code-scanning", "open")
      .toNock();

    await probot.receive({ name: "code_scanning_alert.closed_by_user", payload });

    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  afterEach(() => {
    resetNetworkMonitoring();
  });
});
