import numpy as np
from enum import Enum

# Enums for Game Types


class SystemTypes(Enum):
    BASE = 'base'  # base game with no additional types
    OBSERVE = 'observe'  # system can observe user's reward
    NO_OBSERVE = 'noObserve'  # system can't observe user's reward


class ObserveSystem:
    """
    environment 1: system can observe user's reward
    """

    def __init__(self, K, T):
        self.K = K  # Total number of arms
        self.T = T  # Total number of interactions
        self.t = 0  # Current interaction step
        self.recommend_list = []  # Collected History - recommendation sequence
        self.decisions = []  # Collected History - user decision sequence, accept : 1, reject : 0
        self.rewards = []  # Collected History - numerical reward sequence
        self.pull_counts = np.ones(K) * 1e-6  # Number of pull for each arm
        self.avg_rewards = np.zeros(K)  # Average reward for each arm
        self.ucb_scores = np.zeros(K)  # Upper confidence bound for each arm
        self.rejected_arms = np.zeros(
            K)  # Mark recently rejected arms with -1. Reset to all 0 whenever recommendation is accepted.
        self.BIG_NUM = 1e6  # Large constant to avoid overflow

    def reset(self):
        self.t = 0
        self.decisions = []
        self.rewards = []
        self.pull_counts = np.ones(self.K) * 1e-6
        self.avg_rewards = np.zeros(self.K)
        self.ucb_scores = np.zeros(self.K)
        self.rejected_arms = np.zeros(self.K)

    def recommend(self):
        """
        :return: the index of recommended arm from [0, 1, ..., K-1]
        """
        if self.t >= self.T:
            print("Max iteration number achieved!")
            return None
        if self.rejected_arms.sum() < 0.5 - self.K:
            print("You have rejected all the options!")
        self.t += 1
        # calculate UCB scores according to UCB1 algorithm
        self.ucb_scores = self.avg_rewards + \
            np.sqrt(2.0 * np.log(self.t) / self.pull_counts)
        # exclude the recently rejected arm
        self.ucb_scores += self.rejected_arms * self.BIG_NUM
        # return the arm with the highest UCB with random tiebreaker
        return np.random.choice(np.flatnonzero(self.ucb_scores == self.ucb_scores.max()))

    def get_user_response(self, arm_id, decision, reward=None):
        """
        :param arm_id: which arm the user responds to. from [0, 1, ..., K-1]
        :param decision: accept - 1, reject - 0
        :param reward: numerical reward
        :return:
        """
        self.recommend_list.append(arm_id)
        self.decisions.append(decision)
        self.rewards.append(reward)
        if decision == 1:
            # if accepted, update avg_rewards and pull_counts
            assert reward is not None
            count_plus_one = np.round(1.0 + self.pull_counts[arm_id])
            self.avg_rewards[arm_id] = (
                self.avg_rewards[arm_id] * self.pull_counts[arm_id] + reward) / count_plus_one
            self.pull_counts[arm_id] = count_plus_one
            # clear the rejected arms
            self.rejected_arms = np.zeros(self.K)
        else:
            # record the rejected arm so it will not be recommended for the next round
            self.rejected_arms[arm_id] = -1.0


class NoObserveSystem:
    """
    environment 2: system cannot observe user's reward
    """

    def __init__(self, K, T, N=None):
        self.K = K  # Total number of arms
        self.T = T  # Total number of interactions
        if N is None:  # Length of Phase-1
            self.N = T // 2
        else:
            self.N = min(N, T)
        self.t = 0  # Current interaction step
        self.recommend_list = []  # Collected History - recommendation sequence
        self.decisions = []  # Collected History - user decision sequence, accept : 1, reject : 0
        self.pull_counts = np.zeros(K)  # Number of pull for each arm
        self.reject_counts = np.zeros(K)  # Number of rejection for each arm
        # Arms available for recommendation
        self.candidate_arms = [i for i in range(K)]
        np.random.shuffle(self.candidate_arms)

    def reset(self):
        self.t = 0
        self.decisions = []
        self.pull_counts = np.zeros(self.K)
        self.reject_counts = np.zeros(self.K)
        self.reset_candidate_arms()

    def reset_candidate_arms(self):
        self.candidate_arms = [i for i in range(self.K)]
        np.random.shuffle(self.candidate_arms)

    def recommend(self):
        """
        :return: the index of recommended arm from [0, 1, ..., K-1]
        """
        if self.t >= self.T:
            print("Max iteration number achieved!")
            return None
        self.t += 1
        if self.t <= self.N:  # Phase-1
            if min(self.pull_counts) == 0:
                # if there are arms that have never been pulled, recommend one of them randomly
                return np.random.choice(np.flatnonzero(self.pull_counts == 0))
            else:
                if not self.candidate_arms:  # if candidate arm set is empty, reset
                    self.reset_candidate_arms()
                # keep recommending a randomly selected arm in the candidate set
                return self.candidate_arms[0]
        else:  # Phase-2
            if self.t == self.N + 1 or not self.candidate_arms:  # reset candidate arm set at beginning of Phase-2
                self.reset_candidate_arms()
            least_num_pull = np.min([self.pull_counts[i]
                                    for i in self.candidate_arms])
            # find the least pulled arms in the candidate set
            least_pulled = [i for i in np.flatnonzero(
                self.pull_counts == least_num_pull) if i in self.candidate_arms]
            # recommend one least pulled arm with random tiebreaker
            return np.random.choice(least_pulled)

    def get_user_response(self, arm_id, decision):
        """
        :param arm_id: which arm the user responds to. from [0, 1, ..., K-1]
        :param decision: accept - 1, reject - 0
        :return:
        """
        self.recommend_list.append(arm_id)
        self.decisions.append(decision)
        if decision == 1:
            # if accepted, update pull_counts
            self.pull_counts[arm_id] += 1
        else:
            # if rejected, update reject_counts
            self.reject_counts[arm_id] += 1
            self.candidate_arms.remove(arm_id)


# test
if __name__ == "__main__":
    system1 = ObserveSystem(K=3, T=10)
    a1 = system1.recommend()
    system1.get_user_response(arm_id=a1, decision=1, reward=1.2)
    a2 = system1.recommend()
    system1.get_user_response(arm_id=a2, decision=0, reward=None)

    system2 = NoObserveSystem(K=3, T=100, N=10)
    a1 = system2.recommend()
    system2.get_user_response(arm_id=a1, decision=1)
    a2 = system2.recommend()
    system2.get_user_response(arm_id=a2, decision=0)
    a3 = system2.recommend()
    system2.get_user_response(arm_id=a3, decision=1)
    a4 = system2.recommend()
    system2.get_user_response(arm_id=a4, decision=1)
    a5 = system2.recommend()
    system2.get_user_response(arm_id=a5, decision=1)
    a6 = system2.recommend()
    system2.get_user_response(arm_id=a6, decision=1)
    a7 = system2.recommend()
    system2.get_user_response(arm_id=a7, decision=0)
    a8 = system2.recommend()
    system2.get_user_response(arm_id=a8, decision=1)
    a9 = system2.recommend()
    system2.get_user_response(arm_id=a9, decision=0)
    system2.recommend()
