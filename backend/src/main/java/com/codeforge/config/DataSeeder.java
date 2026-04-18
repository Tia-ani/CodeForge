package com.codeforge.config;

import com.codeforge.model.*;
import com.codeforge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the H2 database with initial data on startup.
 * Creates an admin user, sample users, and 20 LeetCode-style problems with test cases.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (problemRepository.count() == 0) {
            seedProblems();
        }
    }

    private void seedUsers() {
        // Admin user
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@codeforge.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin = userRepository.save(admin);

        Leaderboard adminLb = new Leaderboard();
        adminLb.setUser(admin);
        adminLb.setTotalScore(0);
        adminLb.setProblemsSolved(0);
        leaderboardRepository.save(adminLb);

        // Sample user
        User user = new User();
        user.setName("Anishka Khurana");
        user.setEmail("anishka@codeforge.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole("USER");
        user = userRepository.save(user);

        Leaderboard userLb = new Leaderboard();
        userLb.setUser(user);
        userLb.setTotalScore(0);
        userLb.setProblemsSolved(0);
        leaderboardRepository.save(userLb);

        System.out.println("[DataSeeder] Created admin (admin@codeforge.com / admin123) and sample user.");
    }

    private void seedProblems() {
        // ── EASY Problems ──────────────────────────────────────
        createProblem("Two Sum",
                "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
                "EASY",
                "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
                new String[]{"[2,7,11,15]\n9", "[3,2,4]\n6", "[3,3]\n6"},
                new String[]{"[0,1]", "[1,2]", "[0,1]"});

        createProblem("Valid Parentheses",
                "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
                "EASY",
                "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'",
                new String[]{"()", "()[]{}", "(]", "([)]"},
                new String[]{"true", "true", "false", "false"});

        createProblem("Climbing Stairs",
                "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
                "EASY",
                "1 <= n <= 45",
                new String[]{"2", "3", "4"},
                new String[]{"2", "3", "5"});

        createProblem("Best Time to Buy and Sell Stock",
                "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
                "EASY",
                "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
                new String[]{"[7,1,5,3,6,4]", "[7,6,4,3,1]"},
                new String[]{"5", "0"});

        createProblem("Reverse Linked List",
                "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
                "EASY",
                "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
                new String[]{"[1,2,3,4,5]", "[1,2]", "[]"},
                new String[]{"[5,4,3,2,1]", "[2,1]", "[]"});

        createProblem("Maximum Subarray",
                "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
                "EASY",
                "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
                new String[]{"[-2,1,-3,4,-1,2,1,-5,4]", "[1]", "[5,4,-1,7,8]"},
                new String[]{"6", "1", "23"});

        createProblem("Merge Two Sorted Lists",
                "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
                "EASY",
                "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100",
                new String[]{"[1,2,4]\n[1,3,4]", "[]\n[]", "[]\n[0]"},
                new String[]{"[1,1,2,3,4,4]", "[]", "[0]"});

        // ── MEDIUM Problems ────────────────────────────────────
        createProblem("Add Two Numbers",
                "You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit.\n\nAdd the two numbers and return the sum as a linked list.",
                "MEDIUM",
                "The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9",
                new String[]{"[2,4,3]\n[5,6,4]", "[0]\n[0]", "[9,9,9,9,9,9,9]\n[9,9,9,9]"},
                new String[]{"[7,0,8]", "[0]", "[8,9,9,9,0,0,0,1]"});

        createProblem("Longest Substring Without Repeating Characters",
                "Given a string `s`, find the length of the **longest substring** without repeating characters.",
                "MEDIUM",
                "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces",
                new String[]{"abcabcbb", "bbbbb", "pwwkew"},
                new String[]{"3", "1", "3"});

        createProblem("Merge Intervals",
                "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
                "MEDIUM",
                "1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4",
                new String[]{"[[1,3],[2,6],[8,10],[15,18]]", "[[1,4],[4,5]]"},
                new String[]{"[[1,6],[8,10],[15,18]]", "[[1,5]]"});

        createProblem("Coin Change",
                "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
                "MEDIUM",
                "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
                new String[]{"[1,5,10,25]\n30", "[2]\n3", "[1]\n0"},
                new String[]{"2", "-1", "0"});

        createProblem("3Sum",
                "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
                "MEDIUM",
                "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
                new String[]{"[-1,0,1,2,-1,-4]", "[0,1,1]", "[0,0,0]"},
                new String[]{"[[-1,-1,2],[-1,0,1]]", "[]", "[[0,0,0]]"});

        createProblem("Group Anagrams",
                "Given an array of strings `strs`, group the anagrams together. You can return the answer in **any order**.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
                "MEDIUM",
                "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters",
                new String[]{"[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", "[\"\"]", "[\"a\"]"},
                new String[]{"[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", "[[\"\"]]", "[[\"a\"]]"});

        // ── HARD Problems ──────────────────────────────────────
        createProblem("Median of Two Sorted Arrays",
                "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.",
                "HARD",
                "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6",
                new String[]{"[1,3]\n[2]", "[1,2]\n[3,4]"},
                new String[]{"2.00000", "2.50000"});

        createProblem("Trapping Rain Water",
                "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
                "HARD",
                "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
                new String[]{"[0,1,0,2,1,0,1,3,2,1,2,1]", "[4,2,0,3,2,5]"},
                new String[]{"6", "9"});

        createProblem("N-Queens",
                "The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return *all distinct solutions to the **n-queens puzzle***.",
                "HARD",
                "1 <= n <= 9",
                new String[]{"4", "1"},
                new String[]{"[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]", "[[\"Q\"]]"});

        createProblem("Merge K Sorted Lists",
                "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\n**Merge all the linked-lists into one sorted linked-list** and return it.",
                "HARD",
                "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4",
                new String[]{"[[1,4,5],[1,3,4],[2,6]]", "[]", "[[]]"},
                new String[]{"[1,1,2,3,4,4,5,6]", "[]", "[]"});

        createProblem("Longest Valid Parentheses",
                "Given a string containing just the characters `(` and `)`, return the length of the longest valid (well-formed) parentheses substring.",
                "HARD",
                "0 <= s.length <= 3 * 10^4\ns[i] is '(' or ')'",
                new String[]{"(()", ")()())", ""},
                new String[]{"2", "4", "0"});

        createProblem("Word Search II",
                "Given an `m x n` board of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
                "HARD",
                "m == board.length\nn == board[i].length\n1 <= m, n <= 12\n1 <= words.length <= 3 * 10^4\n1 <= words[i].length <= 10",
                new String[]{"[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]]\n[\"oath\",\"pea\",\"eat\",\"rain\"]"},
                new String[]{"[\"eat\",\"oath\"]"});

        createProblem("Regular Expression Matching",
                "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*` where:\n\n- `.` Matches any single character.\n- `*` Matches zero or more of the preceding element.\n\nThe matching should cover the **entire** input string (not partial).",
                "HARD",
                "1 <= s.length <= 20\n1 <= p.length <= 20\ns contains only lowercase English letters.\np contains only lowercase English letters, '.', and '*'.",
                new String[]{"aa\na", "aa\na*", "ab\n.*"},
                new String[]{"false", "true", "true"});

        System.out.println("[DataSeeder] Seeded 20 problems with test cases.");
    }

    private void createProblem(String title, String description, String difficulty,
                                String constraints, String[] inputs, String[] outputs) {
        Problem problem = new Problem();
        problem.setTitle(title);
        problem.setDescription(description);
        problem.setDifficulty(difficulty);
        problem.setConstraints(constraints);

        // First test case is visible (example), rest are hidden
        for (int i = 0; i < inputs.length; i++) {
            TestCase tc = new TestCase();
            tc.setInput(inputs[i]);
            tc.setExpectedOutput(outputs[i]);
            tc.setHidden(i >= 2); // first 2 examples visible, rest hidden
            problem.addTestCase(tc);
        }

        problemRepository.save(problem);
    }
}
