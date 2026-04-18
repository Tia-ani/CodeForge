package com.codeforge.config;

import com.codeforge.model.Problem;
import com.codeforge.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProblemRepository problemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            System.out.println("Seeding LeetCode style problems...");

            Problem p1 = new Problem();
            p1.setTitle("Two Sum");
            p1.setDifficulty("EASY");
            p1.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");

            Problem p2 = new Problem();
            p2.setTitle("Add Two Numbers");
            p2.setDifficulty("MEDIUM");
            p2.setDescription("You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.");

            Problem p3 = new Problem();
            p3.setTitle("Longest Substring Without Repeating Characters");
            p3.setDifficulty("MEDIUM");
            p3.setDescription("Given a string s, find the length of the longest substring without repeating characters.");

            Problem p4 = new Problem();
            p4.setTitle("Median of Two Sorted Arrays");
            p4.setDifficulty("HARD");
            p4.setDescription("Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).");

            Problem p5 = new Problem();
            p5.setTitle("Valid Parentheses");
            p5.setDifficulty("EASY");
            p5.setDescription("Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.");

            Problem p6 = new Problem();
            p6.setTitle("Merge Intervals");
            p6.setDifficulty("MEDIUM");
            p6.setDescription("Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.");

            Problem p7 = new Problem();
            p7.setTitle("Trapping Rain Water");
            p7.setDifficulty("HARD");
            p7.setDescription("Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.");

            Problem p8 = new Problem();
            p8.setTitle("Climbing Stairs");
            p8.setDifficulty("EASY");
            p8.setDescription("You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?");

            Problem p9 = new Problem();
            p9.setTitle("Coin Change");
            p9.setDifficulty("MEDIUM");
            p9.setDescription("You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.");

            Problem p10 = new Problem();
            p10.setTitle("N-Queens");
            p10.setDifficulty("HARD");
            p10.setDescription("The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.");

            problemRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10));
            System.out.println("Seeded 10 algorithmic problems.");
        }
    }
}
