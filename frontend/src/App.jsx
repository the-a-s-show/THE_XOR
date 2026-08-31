import { useState, useEffect, useMemo } from 'react'
import './App.css'

const getLocalDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getYesterdayDateString = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getHeatmapLevels = (solvedDates) => {
  const levels = []
  const safeDates = (solvedDates && typeof solvedDates === 'object') ? solvedDates : {}
  for (let i = 34; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const dayList = Array.isArray(safeDates[dateStr]) ? safeDates[dateStr] : []
    const count = dayList.length
    if (count === 0) {
      levels.push(0)
    } else if (count === 1) {
      levels.push(1)
    } else {
      levels.push(3)
    }
  }
  return levels
}

const calculateStreak = (solvedDates) => {
  const safeDates = (solvedDates && typeof solvedDates === 'object') ? solvedDates : {}
  let streakCount = 0
  let checkingDate = new Date()
  
  const formatDateStr = (dateObj) => {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const todayStr = formatDateStr(checkingDate)
  const todaySolved = Array.isArray(safeDates[todayStr]) && safeDates[todayStr].length > 0
  
  if (todaySolved) {
    while (true) {
      const dateStr = formatDateStr(checkingDate)
      const hasSolved = Array.isArray(safeDates[dateStr]) && safeDates[dateStr].length > 0
      if (hasSolved) {
        streakCount++
        checkingDate.setDate(checkingDate.getDate() - 1)
      } else {
        break
      }
    }
  } else {
    checkingDate.setDate(checkingDate.getDate() - 1)
    const yesterdayStr = formatDateStr(checkingDate)
    const yesterdaySolved = Array.isArray(safeDates[yesterdayStr]) && safeDates[yesterdayStr].length > 0
    
    if (yesterdaySolved) {
      while (true) {
        const dateStr = formatDateStr(checkingDate)
        const hasSolved = Array.isArray(safeDates[dateStr]) && safeDates[dateStr].length > 0
        if (hasSolved) {
          streakCount++
          checkingDate.setDate(checkingDate.getDate() - 1)
        } else {
          break
        }
      }
    }
  }
  
  return streakCount
}

const sidebarSheets = [
  { name: 'XOR 450 Sheet', count: 450, badgeClass: 'badge-new', active: true },
  { name: 'NeetCode 150', count: 150, badgeClass: 'badge-medium', url: 'https://neetcode.io/practice/practice/neetcode150' },
]

const topics = [
  { name: 'Arrays', count: 42 },
  { name: 'Linked Lists', count: 24 },
  { name: 'Trees', count: 35 },
  { name: 'Graphs', count: 29 },
  { name: 'Dynamic Programming', count: 51 },
  { name: 'Recursion & Backtracking', count: 18 },
  { name: 'Binary Search', count: 22 },
  { name: 'Bit Manipulation', count: 14 },
]

const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Flipkart']

const problems = [
  { id: 1, solved: false, title: 'Two Sum', tags: ['Array', 'Hash Map'], diff: 'Easy', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, solved: false, title: 'Best Time to Buy and Sell Stock', tags: ['Array', 'DP'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 3, solved: false, title: 'Contains Duplicate', tags: ['Array', 'Hash Set'], diff: 'Easy', companies: ['Apple'], url: 'https://leetcode.com/problems/contains-duplicate/' },
  { id: 4, solved: false, title: 'Product of Array Except Self', tags: ['Array', 'Prefix Sum'], diff: 'Medium', companies: ['Amazon', 'Meta'], url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 5, solved: false, title: 'Maximum Subarray', tags: ['Array', 'DP'], diff: 'Medium', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 6, solved: false, title: 'Maximum Product Subarray', tags: ['Array', 'DP'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { id: 7, solved: false, title: 'Find Minimum in Rotated Sorted Array', tags: ['Array', 'Binary Search'], diff: 'Medium', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { id: 8, solved: false, title: 'Search in Rotated Sorted Array', tags: ['Array', 'Binary Search'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 9, solved: false, title: '3Sum', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Google', 'Facebook'], url: 'https://leetcode.com/problems/3sum/' },
  { id: 10, solved: false, title: 'Container With Most Water', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 11, solved: false, title: 'Move Zeroes', tags: ['Array', 'Two Pointer'], diff: 'Easy', companies: ['Google', 'Facebook'], url: 'https://leetcode.com/problems/move-zeroes/' },
  { id: 12, solved: false, title: 'Remove Duplicates from Sorted Array', tags: ['Array', 'Two Pointer'], diff: 'Easy', companies: ['Google', 'Apple'], url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
  { id: 13, solved: false, title: 'Rotate Array', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Microsoft', 'Amazon'], url: 'https://leetcode.com/problems/rotate-array/' },
  { id: 14, solved: false, title: 'Missing Number', tags: ['Array', 'Bit Manipulation'], diff: 'Easy', companies: ['Microsoft'], url: 'https://leetcode.com/problems/missing-number/' },
  { id: 15, solved: false, title: 'Find All Numbers Disappeared in an Array', tags: ['Array', 'Hash Set'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/' },
  { id: 16, solved: false, title: 'Single Number', tags: ['Array', 'Bit Manipulation'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/single-number/' },
  { id: 17, solved: false, title: 'Majority Element', tags: ['Array', 'Hash Map'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/majority-element/' },
  { id: 18, solved: false, title: 'Intersection of Two Arrays', tags: ['Array', 'Hash Set'], diff: 'Easy', companies: ['Facebook'], url: 'https://leetcode.com/problems/intersection-of-two-arrays/' },
  { id: 19, solved: false, title: 'Intersection of Two Arrays II', tags: ['Array', 'Hash Map'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/intersection-of-two-arrays-ii/' },
  { id: 20, solved: false, title: 'Merge Sorted Array', tags: ['Array', 'Two Pointer'], diff: 'Easy', companies: ['Microsoft'], url: 'https://leetcode.com/problems/merge-sorted-array/' },
  { id: 21, solved: false, title: 'Sort Colors', tags: ['Array', 'Two Pointer', 'Sorting'], diff: 'Medium', companies: ['Microsoft', 'Google'], url: 'https://leetcode.com/problems/sort-colors/' },
  { id: 22, solved: false, title: 'Next Permutation', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/next-permutation/' },
  { id: 23, solved: false, title: 'Find the Duplicate Number', tags: ['Array', 'Binary Search'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
  { id: 24, solved: false, title: 'Subarray Sum Equals K', tags: ['Array', 'Prefix Sum', 'Hash Map'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
  { id: 25, solved: false, title: 'Longest Consecutive Sequence', tags: ['Array', 'Hash Set'], diff: 'Medium', companies: ['Google', 'Meta'], url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
  { id: 26, solved: false, title: 'Maximum Length of Subarray With Positive Product', tags: ['Array', 'DP'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/' },
  { id: 27, solved: false, title: 'Set Matrix Zeroes', tags: ['Array', 'Matrix'], diff: 'Medium', companies: ['Microsoft'], url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { id: 28, solved: false, title: 'Spiral Matrix', tags: ['Array', 'Matrix'], diff: 'Medium', companies: ['Google', 'Apple'], url: 'https://leetcode.com/problems/spiral-matrix/' },
  { id: 29, solved: false, title: 'Rotate Image', tags: ['Array', 'Matrix'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/rotate-image/' },
  { id: 30, solved: false, title: 'Game of Life', tags: ['Array', 'Matrix'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/game-of-life/' },
  { id: 31, solved: false, title: 'Merge Intervals', tags: ['Array', 'Sorting'], diff: 'Medium', companies: ['Google', 'Facebook'], url: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 32, solved: false, title: 'Insert Interval', tags: ['Array', 'Sorting'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/insert-interval/' },
  { id: 33, solved: false, title: 'Non-overlapping Intervals', tags: ['Array', 'Greedy'], diff: 'Medium', companies: ['Microsoft'], url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
  { id: 34, solved: false, title: 'Meeting Rooms II', tags: ['Array', 'Sorting', 'Heap'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  { id: 35, solved: false, title: 'Kth Largest Element in an Array', tags: ['Array', 'Heap', 'Quickselect'], diff: 'Medium', companies: ['Amazon', 'Facebook'], url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { id: 36, solved: false, title: 'Top K Frequent Elements', tags: ['Array', 'Heap', 'Hash Map'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 37, solved: false, title: 'Longest Increasing Subsequence', tags: ['Array', 'DP'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 38, solved: false, title: 'Maximum Sum Circular Subarray', tags: ['Array', 'Prefix Sum'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/' },
  { id: 39, solved: false, title: 'Jump Game', tags: ['Array', 'Greedy', 'DP'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/jump-game/' },
  { id: 40, solved: false, title: 'Jump Game II', tags: ['Array', 'Greedy', 'DP'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/jump-game-ii/' },
  { id: 41, solved: false, title: 'Trapping Rain Water', tags: ['Array', 'Two Pointer', 'Stack'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 42, solved: false, title: 'First Missing Positive', tags: ['Array', 'Hash Map'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/first-missing-positive/' },
  { id: 43, solved: false, title: 'Largest Rectangle in Histogram', tags: ['Array', 'Stack'], diff: 'Hard', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  { id: 44, solved: false, title: 'Sliding Window Maximum', tags: ['Array', 'Sliding Window', 'Queue'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { id: 45, solved: false, title: 'Minimum Size Subarray Sum', tags: ['Array', 'Sliding Window', 'Two Pointer'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
  { id: 46, solved: false, title: 'Subarray Product Less Than K', tags: ['Array', 'Sliding Window', 'Two Pointer'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/subarray-product-less-than-k/' },
  { id: 47, solved: false, title: '4Sum', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/4sum/' },
  { id: 48, solved: false, title: 'Median of Two Sorted Arrays', tags: ['Array', 'Binary Search'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 49, solved: false, title: 'Count of Smaller Numbers After Self', tags: ['Array', 'Segment Tree', 'Fenwick Tree'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
  { id: 50, solved: false, title: 'Shortest Unsorted Continuous Subarray', tags: ['Array', 'Two Pointer'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/shortest-unsorted-continuous-subarray/' },
  { id: 51, solved: false, title: 'Valid Anagram', tags: ['String', 'Hash Map'], diff: 'Easy', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 52, solved: false, title: 'Valid Palindrome', tags: ['String', 'Two Pointer'], diff: 'Easy', companies: ['Facebook', 'Microsoft'], url: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 53, solved: false, title: 'Valid Parentheses', tags: ['String', 'Stack'], diff: 'Easy', companies: ['Amazon', 'Meta'], url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 54, solved: false, title: 'Longest Common Prefix', tags: ['String', 'String Traversal'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/longest-common-prefix/' },
  { id: 55, solved: false, title: 'Reverse Words in a String', tags: ['String', 'String Manipulation'], diff: 'Medium', companies: ['Microsoft', 'Apple'], url: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
  { id: 56, solved: false, title: 'Longest Substring Without Repeating Characters', tags: ['String', 'Sliding Window'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 57, solved: false, title: 'Longest Palindromic Substring', tags: ['String', 'DP', 'Two Pointer'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 58, solved: false, title: 'Group Anagrams', tags: ['String', 'Hash Map'], diff: 'Medium', companies: ['Amazon', 'Meta'], url: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 59, solved: false, title: 'String to Integer (atoi)', tags: ['String', 'String Parsing'], diff: 'Medium', companies: ['Google', 'Microsoft'], url: 'https://leetcode.com/problems/string-to-integer-atoi/' },
  { id: 60, solved: false, title: 'Permutation in String', tags: ['String', 'Sliding Window'], diff: 'Medium', companies: ['Microsoft'], url: 'https://leetcode.com/problems/permutation-in-string/' },
  { id: 61, solved: false, title: 'Find All Anagrams in a String', tags: ['String', 'Sliding Window'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
  { id: 62, solved: false, title: 'Minimum Window Substring', tags: ['String', 'Sliding Window'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/minimum-window-substring/' },
  { id: 63, solved: false, title: 'Decode String', tags: ['String', 'Stack'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/decode-string/' },
  { id: 64, solved: false, title: 'Word Break', tags: ['String', 'DP'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/word-break/' },
  { id: 65, solved: false, title: 'Edit Distance', tags: ['String', 'DP'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/edit-distance/' },
  { id: 66, solved: false, title: 'Reverse Linked List', tags: ['Linked List'], diff: 'Easy', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 67, solved: false, title: 'Middle of the Linked List', tags: ['Linked List', 'Two Pointer'], diff: 'Easy', companies: ['Adobe'], url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
  { id: 68, solved: false, title: 'Linked List Cycle', tags: ['Linked List', 'Two Pointer'], diff: 'Easy', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 69, solved: false, title: 'Merge Two Sorted Lists', tags: ['Linked List', 'Two Pointer'], diff: 'Easy', companies: ['Google', 'Apple'], url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 70, solved: false, title: 'Remove Linked List Elements', tags: ['Linked List'], diff: 'Easy', companies: ['Microsoft'], url: 'https://leetcode.com/problems/remove-linked-list-elements/' },
  { id: 71, solved: false, title: 'Remove Nth Node From End of List', tags: ['Linked List', 'Two Pointer'], diff: 'Medium', companies: ['Google', 'Meta'], url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 72, solved: false, title: 'Intersection of Two Linked Lists', tags: ['Linked List', 'Two Pointer'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
  { id: 73, solved: false, title: 'Palindrome Linked List', tags: ['Linked List', 'Two Pointer'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/palindrome-linked-list/' },
  { id: 74, solved: false, title: 'Add Two Numbers', tags: ['Linked List', 'Math'], diff: 'Medium', companies: ['Amazon', 'Google', 'Microsoft'], url: 'https://leetcode.com/problems/add-two-numbers/' },
  { id: 75, solved: false, title: 'Odd Even Linked List', tags: ['Linked List', 'Two Pointer'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/odd-even-linked-list/' },
  { id: 76, solved: false, title: 'Sort List', tags: ['Linked List', 'Merge Sort'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/sort-list/' },
  { id: 77, solved: false, title: 'Copy List with Random Pointer', tags: ['Linked List', 'Hash Map'], diff: 'Medium', companies: ['Amazon', 'Google', 'Meta'], url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { id: 78, solved: false, title: 'Rotate List', tags: ['Linked List', 'Two Pointer'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/rotate-list/' },
  { id: 79, solved: false, title: 'Reverse Linked List II', tags: ['Linked List'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/reverse-linked-list-ii/' },
  { id: 80, solved: false, title: 'Merge k Sorted Lists', tags: ['Linked List', 'Divide & Conquer', 'Heap'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { id: 81, solved: false, title: 'Maximum Depth of Binary Tree', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 82, solved: false, title: 'Invert Binary Tree', tags: ['Tree', 'Recursion'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 83, solved: false, title: 'Same Tree', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/same-tree/' },
  { id: 84, solved: false, title: 'Binary Tree Inorder Traversal', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
  { id: 85, solved: false, title: 'Binary Tree Level Order Traversal', tags: ['Tree', 'BFS'], diff: 'Medium', companies: ['Google', 'Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 86, solved: false, title: 'Symmetric Tree', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Microsoft', 'Amazon'], url: 'https://leetcode.com/problems/symmetric-tree/' },
  { id: 87, solved: false, title: 'Diameter of Binary Tree', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { id: 88, solved: false, title: 'Balanced Binary Tree', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/balanced-binary-tree/' },
  { id: 89, solved: false, title: 'Lowest Common Ancestor of a Binary Tree', tags: ['Tree', 'DFS'], diff: 'Medium', companies: ['Google', 'Amazon', 'Facebook'], url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
  { id: 90, solved: false, title: 'Binary Tree Right Side View', tags: ['Tree', 'BFS', 'DFS'], diff: 'Medium', companies: ['Google', 'Amazon', 'Facebook'], url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
  { id: 91, solved: false, title: 'Validate Binary Search Tree', tags: ['Tree', 'BST'], diff: 'Medium', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 92, solved: false, title: 'Kth Smallest Element in a BST', tags: ['Tree', 'BST'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
  { id: 93, solved: false, title: 'Construct Binary Tree from Preorder and Inorder Traversal', tags: ['Tree', 'Recursion'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 94, solved: false, title: 'Path Sum', tags: ['Tree', 'DFS'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/path-sum/' },
  { id: 95, solved: false, title: 'Binary Tree Maximum Path Sum', tags: ['Tree', 'DFS', 'DP'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { id: 96, solved: false, title: 'Climbing Stairs', tags: ['DP'], diff: 'Easy', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 97, solved: false, title: 'Min Cost Climbing Stairs', tags: ['DP'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
  { id: 98, solved: false, title: 'House Robber', tags: ['DP'], diff: 'Medium', companies: ['Google', 'Meta'], url: 'https://leetcode.com/problems/house-robber/' },
  { id: 99, solved: false, title: 'House Robber II', tags: ['DP'], diff: 'Medium', companies: ['Microsoft'], url: 'https://leetcode.com/problems/house-robber-ii/' },
  { id: 100, solved: false, title: 'Maximum Subarray', tags: ['DP', 'Array'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 101, solved: false, title: 'Decode Ways', tags: ['DP', 'String'], diff: 'Medium', companies: ['Google', 'Facebook'], url: 'https://leetcode.com/problems/decode-ways/' },
  { id: 102, solved: false, title: 'Word Break', tags: ['DP', 'String'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/word-break/' },
  { id: 103, solved: false, title: 'Partition Equal Subset Sum', tags: ['DP'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
  { id: 104, solved: false, title: 'Target Sum', tags: ['DP'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/target-sum/' },
  { id: 105, solved: false, title: 'Coin Change', tags: ['DP'], diff: 'Medium', companies: ['Amazon', 'Google', 'Meta'], url: 'https://leetcode.com/problems/coin-change/' },
  { id: 106, solved: false, title: 'Coin Change II', tags: ['DP'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/coin-change-ii/' },
  { id: 107, solved: false, title: 'Combination Sum IV', tags: ['DP'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/combination-sum-iv/' },
  { id: 108, solved: false, title: 'Unique Paths', tags: ['DP', 'Matrix'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/unique-paths/' },
  { id: 109, solved: false, title: 'Unique Paths II', tags: ['DP', 'Matrix'], diff: 'Medium', companies: ['Microsoft'], url: 'https://leetcode.com/problems/unique-paths-ii/' },
  { id: 110, solved: false, title: 'Minimum Path Sum', tags: ['DP', 'Matrix'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/minimum-path-sum/' },
  { id: 111, solved: false, title: 'Triangle', tags: ['DP', 'Matrix'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/triangle/' },
  { id: 112, solved: false, title: 'Longest Common Subsequence', tags: ['DP', 'String'], diff: 'Medium', companies: ['Google', 'Meta'], url: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 113, solved: false, title: 'Longest Palindromic Subsequence', tags: ['DP', 'String'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/longest-palindromic-subsequence/' },
  { id: 114, solved: false, title: 'Edit Distance', tags: ['DP', 'String'], diff: 'Hard', companies: ['Google', 'Microsoft'], url: 'https://leetcode.com/problems/edit-distance/' },
  { id: 115, solved: false, title: 'Distinct Subsequences', tags: ['DP', 'String'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/distinct-subsequences/' },
  { id: 116, solved: false, title: 'Longest Increasing Subsequence', tags: ['DP'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 117, solved: false, title: 'Maximum Product Subarray', tags: ['DP', 'Array'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { id: 118, solved: false, title: 'Best Time to Buy and Sell Stock with Cooldown', tags: ['DP'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
  { id: 119, solved: false, title: 'Burst Balloons', tags: ['DP'], diff: 'Hard', companies: ['Google', 'Amazon', 'Meta'], url: 'https://leetcode.com/problems/burst-balloons/' },
  { id: 120, solved: false, title: 'Longest Valid Parentheses', tags: ['DP', 'String'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/longest-valid-parentheses/' },
  { id: 121, solved: false, title: 'Number of Islands', tags: ['Graph', 'BFS', 'DFS'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 122, solved: false, title: 'Flood Fill', tags: ['Graph', 'DFS'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/flood-fill/' },
  { id: 123, solved: false, title: 'Max Area of Island', tags: ['Graph', 'DFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/max-area-of-island/' },
  { id: 124, solved: false, title: 'Clone Graph', tags: ['Graph', 'BFS', 'DFS'], diff: 'Medium', companies: ['Google', 'Meta'], url: 'https://leetcode.com/problems/clone-graph/' },
  { id: 125, solved: false, title: 'Rotting Oranges', tags: ['Graph', 'BFS'], diff: 'Medium', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/rotting-oranges/' },
  { id: 126, solved: false, title: 'Pacific Atlantic Water Flow', tags: ['Graph', 'DFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 127, solved: false, title: 'Course Schedule', tags: ['Graph', 'Topological Sort'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/course-schedule/' },
  { id: 128, solved: false, title: 'Course Schedule II', tags: ['Graph', 'Topological Sort'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/course-schedule-ii/' },
  { id: 129, solved: false, title: 'Graph Valid Tree', tags: ['Graph', 'Union Find'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/graph-valid-tree/' },
  { id: 130, solved: false, title: 'Number of Connected Components in an Undirected Graph', tags: ['Graph', 'Union Find'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  { id: 131, solved: false, title: 'Is Graph Bipartite?', tags: ['Graph', 'BFS', 'DFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/is-graph-bipartite/' },
  { id: 132, solved: false, title: 'Possible Bipartition', tags: ['Graph', 'DFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/possible-bipartition/' },
  { id: 133, solved: false, title: 'Alien Dictionary', tags: ['Graph', 'Topological Sort'], diff: 'Hard', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/alien-dictionary/' },
  { id: 134, solved: false, title: 'Parallel Courses', tags: ['Graph', 'Topological Sort'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/parallel-courses/' },
  { id: 135, solved: false, title: 'Find Eventual Safe States', tags: ['Graph', 'DFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/find-eventual-safe-states/' },
  { id: 136, solved: false, title: 'Network Delay Time', tags: ['Graph', 'Dijkstra'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/network-delay-time/' },
  { id: 137, solved: false, title: 'Cheapest Flights Within K Stops', tags: ['Graph', 'Bellman-Ford', 'Dijkstra'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
  { id: 138, solved: false, title: 'Path With Minimum Effort', tags: ['Graph', 'Dijkstra'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/path-with-minimum-effort/' },
  { id: 139, solved: false, title: 'Shortest Path in Binary Matrix', tags: ['Graph', 'BFS'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
  { id: 140, solved: false, title: 'Word Ladder', tags: ['Graph', 'BFS'], diff: 'Hard', companies: ['Amazon', 'Google', 'Meta'], url: 'https://leetcode.com/problems/word-ladder/' },
  { id: 141, solved: false, title: 'Open the Lock', tags: ['Graph', 'BFS'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/open-the-lock/' },
  { id: 142, solved: false, title: 'Redundant Connection', tags: ['Graph', 'Union Find'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/redundant-connection/' },
  { id: 143, solved: false, title: 'Accounts Merge', tags: ['Graph', 'Union Find'], diff: 'Medium', companies: ['Google', 'Amazon', 'Facebook'], url: 'https://leetcode.com/problems/accounts-merge/' },
  { id: 144, solved: false, title: 'Min Cost to Connect All Points', tags: ['Graph', 'Prim', 'Kruskal'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
  { id: 145, solved: false, title: 'Number of Operations to Make Network Connected', tags: ['Graph', 'Union Find'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/' },
  { id: 146, solved: false, title: 'Reconstruct Itinerary', tags: ['Graph', 'DFS'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  { id: 147, solved: false, title: 'Critical Connections in a Network', tags: ['Graph', 'DFS', 'Bridges'], diff: 'Hard', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/critical-connections-in-a-network/' },
  { id: 148, solved: false, title: 'Swim in Rising Water', tags: ['Graph', 'Dijkstra'], diff: 'Hard', companies: ['Google'], url: 'https://leetcode.com/problems/swim-in-rising-water/' },
  { id: 149, solved: false, title: 'Evaluate Division', tags: ['Graph', 'DFS'], diff: 'Medium', companies: ['Amazon', 'Google'], url: 'https://leetcode.com/problems/evaluate-division/' },
  { id: 150, solved: false, title: 'Word Ladder II', tags: ['Graph', 'BFS', 'DFS'], diff: 'Hard', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/word-ladder-ii/' },
  { id: 151, solved: false, title: 'Single Number', tags: ['Bit Manipulation'], diff: 'Easy', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/single-number/' },
  { id: 152, solved: false, title: 'Number of 1 Bits', tags: ['Bit Manipulation'], diff: 'Easy', companies: ['Apple', 'Microsoft'], url: 'https://leetcode.com/problems/number-of-1-bits/' },
  { id: 153, solved: false, title: 'Counting Bits', tags: ['Bit Manipulation', 'DP'], diff: 'Easy', companies: ['Amazon'], url: 'https://leetcode.com/problems/counting-bits/' },
  { id: 154, solved: false, title: 'Reverse Bits', tags: ['Bit Manipulation'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/reverse-bits/' },
  { id: 155, solved: false, title: 'Missing Number', tags: ['Bit Manipulation'], diff: 'Easy', companies: ['Amazon', 'Microsoft'], url: 'https://leetcode.com/problems/missing-number/' },
  { id: 156, solved: false, title: 'Power of Two', tags: ['Bit Manipulation'], diff: 'Easy', companies: ['Google'], url: 'https://leetcode.com/problems/power-of-two/' },
  { id: 157, solved: false, title: 'Sum of Two Integers', tags: ['Bit Manipulation'], diff: 'Medium', companies: ['Google', 'Amazon'], url: 'https://leetcode.com/problems/sum-of-two-integers/' },
  { id: 158, solved: false, title: 'Single Number II', tags: ['Bit Manipulation'], diff: 'Medium', companies: ['Amazon'], url: 'https://leetcode.com/problems/single-number-ii/' },
  { id: 159, solved: false, title: 'Subsets', tags: ['Bit Manipulation', 'Backtracking'], diff: 'Medium', companies: ['Amazon', 'Facebook', 'Google'], url: 'https://leetcode.com/problems/subsets/' },
  { id: 160, solved: false, title: 'Maximum XOR for Each Query', tags: ['Bit Manipulation'], diff: 'Medium', companies: ['Google'], url: 'https://leetcode.com/problems/maximum-xor-for-each-query/' }
]
const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' }

function App() {
  const dailyProblem = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % problems.length;
    return problems[index];
  }, []);

  const [activeTab, setActiveTab] = useState('All Problems')
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedProblems, setDisplayedProblems] = useState(problems)
  const [solvedDates, setSolvedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('xor-solved-dates')
      const parsed = saved ? JSON.parse(saved) : {}
      return (parsed && typeof parsed === 'object') ? parsed : {}
    } catch (e) {
      return {}
    }
  })

  const heatmapLevels = getHeatmapLevels(solvedDates)

  const [activeNoteProblemId, setActiveNoteProblemId] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('xor-dsa-notes')
      const parsed = saved ? JSON.parse(saved) : {}
      return (parsed && typeof parsed === 'object') ? parsed : {}
    } catch (e) {
      return {}
    }
  })
  const [solvedProblemIds, setSolvedProblemIds] = useState(() => {
    try {
      const saved = localStorage.getItem('xor-solved-problems-v2')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return new Set(parsed)
        }
      }
    } catch (e) {}
    return new Set()
  })

  const streak = calculateStreak(solvedDates)

  const totalEasy = problems.filter((p) => p.diff === 'Easy').length
  const totalMedium = problems.filter((p) => p.diff === 'Medium').length
  const totalHard = problems.filter((p) => p.diff === 'Hard').length

  const solvedEasy = problems.filter((p) => p.diff === 'Easy' && solvedProblemIds.has(p.id)).length
  const solvedMedium = problems.filter((p) => p.diff === 'Medium' && solvedProblemIds.has(p.id)).length
  const solvedHard = problems.filter((p) => p.diff === 'Hard' && solvedProblemIds.has(p.id)).length

  const percentEasy = totalEasy > 0 ? Math.round((solvedEasy / totalEasy) * 100) : 0
  const percentMedium = totalMedium > 0 ? Math.round((solvedMedium / totalMedium) * 100) : 0
  const percentHard = totalHard > 0 ? Math.round((solvedHard / totalHard) * 100) : 0

  const [bestStreak, setBestStreak] = useState(() => {
    try {
      const bs = localStorage.getItem('xor-streak-best')
      return bs ? parseInt(bs, 10) : 0
    } catch (e) {
      return 0
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('xor-streak-count', String(streak))
      if (streak > bestStreak) {
        setBestStreak(streak)
        localStorage.setItem('xor-streak-best', String(streak))
      }
    } catch (e) {}
  }, [streak, bestStreak])

  useEffect(() => {
    try {
      const today = getLocalDateString()
      let datesChanged = false
      const currentDates = (solvedDates && typeof solvedDates === 'object') ? { ...solvedDates } : {}
      if (!Array.isArray(currentDates[today])) {
        currentDates[today] = []
      }
      
      solvedProblemIds.forEach(id => {
        const alreadyRecorded = Object.values(currentDates).some(ids => Array.isArray(ids) && ids.includes(id))
        if (!alreadyRecorded) {
          currentDates[today].push(id)
          datesChanged = true
        }
      })
      
      if (datesChanged) {
        setSolvedDates(currentDates)
        localStorage.setItem('xor-solved-dates', JSON.stringify(currentDates))
      }
    } catch (e) {}
  }, [])

  const handleSaveNote = () => {
    const updatedNotes = {
      ...notes,
      [activeNoteProblemId]: noteText
    }
    setNotes(updatedNotes)
    localStorage.setItem('xor-dsa-notes', JSON.stringify(updatedNotes))
    setActiveNoteProblemId(null)
  }

  const handleSolveProblem = (problemId) => {
    const updated = new Set(solvedProblemIds)
    if (!updated.has(problemId)) {
      updated.add(problemId)
      setSolvedProblemIds(updated)
      localStorage.setItem('xor-solved-problems-v2', JSON.stringify(Array.from(updated)))

      try {
        const today = getLocalDateString()
        const currentDates = { ...solvedDates }
        if (!currentDates[today]) {
          currentDates[today] = []
        }
        if (!currentDates[today].includes(problemId)) {
          currentDates[today].push(problemId)
          setSolvedDates(currentDates)
          localStorage.setItem('xor-solved-dates', JSON.stringify(currentDates))
        }
      } catch (e) {}
    }
  }

  const handleToggleSolve = (problemId) => {
    const updated = new Set(solvedProblemIds)
    const today = getLocalDateString()
    
    if (updated.has(problemId)) {
      updated.delete(problemId)
      try {
        const currentDates = { ...solvedDates }
        Object.keys(currentDates).forEach(dateStr => {
          currentDates[dateStr] = currentDates[dateStr].filter(id => id !== problemId)
        })
        setSolvedDates(currentDates)
        localStorage.setItem('xor-solved-dates', JSON.stringify(currentDates))
      } catch (e) {}
    } else {
      updated.add(problemId)
      try {
        const currentDates = { ...solvedDates }
        if (!currentDates[today]) {
          currentDates[today] = []
        }
        if (!currentDates[today].includes(problemId)) {
          currentDates[today].push(problemId)
          setSolvedDates(currentDates)
          localStorage.setItem('xor-solved-dates', JSON.stringify(currentDates))
        }
      } catch (e) {}
    }
    
    setSolvedProblemIds(updated)
    localStorage.setItem('xor-solved-problems-v2', JSON.stringify(Array.from(updated)))
  }

  const applyTab = (tab) => {
    setActiveTab(tab)
    const filtered =
      tab === 'All Problems'
        ? problems
        : tab === 'Bookmarked'
          ? problems.slice(0, 5)
          : problems.filter((problem) => problem.diff === tab)
    setDisplayedProblems(filtered)
  }

  const applyFilter = (category) => {
    setActiveFilter(category)
    if (category === 'All') {
      setDisplayedProblems(problems)
      return
    }

    const isCompany = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Flipkart'].includes(category);
    if (isCompany) {
      const filtered = problems.filter((problem) => 
        problem.companies.some((comp) => comp.toLowerCase() === category.toLowerCase())
      )
      setDisplayedProblems(filtered)
      return
    }

    const categoryMap = {
      'Arrays & Hashing': 'Array',
      'Trees & BST': 'Tree',
      'Linked List': 'Linked List',
      'Dynamic Programming': 'DP',
      'Graph & DFS/BFS': 'Graph',
      'Bit Manipulation': 'Bit Manipulation',
      'Binary Search': 'Binary Search',
      'Recursion & Backtracking': 'Recursion',
      'Strings': 'String',
      'Arrays': 'Array',
      'Trees': 'Tree',
      'Graphs': 'Graph',
      'Linked Lists': 'Linked List',
      'Heaps & Priority Queue': 'Heap'
    }
    const lookup = categoryMap[category] || category

    const filtered = problems.filter((problem) => {
      if (lookup === 'Recursion') {
        return problem.tags.includes('Recursion') || problem.tags.includes('Backtracking')
      }
      return problem.tags.some((tag) => 
        tag.toLowerCase().includes(lookup.toLowerCase()) || lookup.toLowerCase().includes(tag.toLowerCase())
      )
    })
    setDisplayedProblems(filtered)
  }

  const handleSearch = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    const lowerQuery = query.toLowerCase()

    const filtered = query
      ? problems.filter(
          (problem) =>
            problem.title.toLowerCase().includes(lowerQuery) ||
            problem.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
            problem.companies.some((company) => company.toLowerCase().includes(lowerQuery)),
        )
      : problems

    setDisplayedProblems(filtered)
  }

  const getTopicCount = (name) => {
    const categoryMap = {
      'Arrays & Hashing': 'Array',
      'Trees & BST': 'Tree',
      'Linked Lists': 'Linked List',
      'Linked List': 'Linked List',
      'Dynamic Programming': 'DP',
      'Graphs & BFS/DFS': 'Graph',
      'Bit Manipulation': 'Bit Manipulation',
      'Binary Search': 'Binary Search',
      'Recursion & Backtracking': 'Recursion'
    };
    const categoryTag = categoryMap[name] || name;
    
    return problems.filter(p => {
      if (categoryTag === 'Recursion') {
        return p.tags.includes('Recursion') || p.tags.includes('Backtracking');
      }
      return p.tags.some(tag => tag.toLowerCase().includes(categoryTag.toLowerCase()) || categoryTag.toLowerCase().includes(tag.toLowerCase()));
    }).length;
  };

  const getSidebarTopicCount = (name) => {
    const categoryMap = {
      'Arrays': 'Array',
      'Strings': 'String',
      'Linked Lists': 'Linked List',
      'Trees': 'Tree',
      'Graphs': 'Graph',
      'Dynamic Programming': 'DP',
      'Recursion & Backtracking': 'Recursion',
      'Binary Search': 'Binary Search',
      'Heaps & Priority Queue': 'Heap',
      'Bit Manipulation': 'Bit Manipulation'
    };
    const categoryTag = categoryMap[name] || name;
    
    return problems.filter(p => {
      if (categoryTag === 'Recursion') {
        return p.tags.includes('Recursion') || p.tags.includes('Backtracking');
      }
      return p.tags.some(tag => tag.toLowerCase().includes(categoryTag.toLowerCase()) || categoryTag.toLowerCase().includes(tag.toLowerCase()));
    }).length;
  };

  const getTopicProgress = (name) => {
    const categoryMap = {
      'Arrays & Hashing': 'Array',
      'Trees & BST': 'Tree',
      'Linked Lists': 'Linked List',
      'Linked List': 'Linked List',
      'Dynamic Programming': 'DP',
      'Graphs & BFS/DFS': 'Graph',
      'Bit Manipulation': 'Bit Manipulation',
      'Binary Search': 'Binary Search',
      'Recursion & Backtracking': 'Recursion'
    };
    const categoryTag = categoryMap[name] || name;
    
    const total = getTopicCount(name);
    
    const solved = problems.filter(p => {
      const match = categoryTag === 'Recursion' 
        ? (p.tags.includes('Recursion') || p.tags.includes('Backtracking'))
        : p.tags.some(tag => tag.toLowerCase().includes(categoryTag.toLowerCase()) || categoryTag.toLowerCase().includes(tag.toLowerCase()));
      return match && solvedProblemIds.has(p.id);
    }).length;
    
    return total > 0 ? `${Math.round((solved / total) * 100)}%` : '0%';
  };

  return (
    <div className="page-shell">
      <nav>
        <a className="nav-logo" href="#" onClick={(event) => event.preventDefault()}>
          The XOR
        </a>
        <ul className="nav-links">
          <li><a href="#" className="active" onClick={(event) => event.preventDefault()}>Problems</a></li>
          <li><a href="#" onClick={(event) => event.preventDefault()}>Sheets</a></li>
          <li><a href="#" onClick={(event) => event.preventDefault()}>Learn</a></li>
          <li><a href="#" onClick={(event) => event.preventDefault()}>Contests</a></li>
          <li><a href="#" onClick={(event) => event.preventDefault()}>Discuss</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn btn-ghost" type="button">Sign In</button>
          <button className="btn btn-primary" type="button">Get Started</button>
        </div>
      </nav>

      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header">DSA Sheets</div>
            {sidebarSheets.map((sheet) => (
              <a
                className={`sidebar-item ${sheet.active ? 'active' : ''}`}
                href={sheet.url || '#'}
                key={sheet.name}
                target={sheet.url ? '_blank' : undefined}
                rel={sheet.url ? 'noopener noreferrer' : undefined}
                onClick={(event) => {
                  if (!sheet.url) {
                    event.preventDefault();
                  }
                }}
              >
                <div className="sidebar-item-left">
                  <div className="sidebar-dot"></div>
                  {sheet.name}
                </div>
                <span className={`badge ${sheet.badgeClass}`}>{sheet.count}</span>
              </a>
            ))}
          </div>

          <div className="sidebar-section sidebar-spaced">
            <div className="sidebar-header">Topics</div>
            {topics.map((topic) => {
              const count = getSidebarTopicCount(topic.name)
              return (
                <a 
                  className={`sidebar-item ${activeFilter === topic.name ? 'active' : ''}`}
                  href="#" 
                  key={topic.name} 
                  onClick={(event) => {
                    event.preventDefault()
                    applyFilter(topic.name)
                    setTimeout(() => {
                      const el = document.getElementById('problems-list-section')
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' })
                      }
                    }, 50)
                  }}
                >
                  <div className="sidebar-item-left">
                    <div className="sidebar-dot"></div>
                    {topic.name}
                  </div>
                  <span className="sidebar-count">{count}</span>
                </a>
              )
            })}
          </div>

          <div className="sidebar-section sidebar-spaced">
            <div className="sidebar-header">Companies</div>
            {companies.map((company) => (
              <a 
                className={`sidebar-item ${activeFilter === company ? 'active' : ''}`}
                href="#" 
                key={company} 
                onClick={(event) => {
                  event.preventDefault()
                  applyFilter(company)
                  setTimeout(() => {
                    const el = document.getElementById('problems-list-section')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }, 50)
                }}
              >
                <div className="sidebar-item-left">
                  <div className="sidebar-dot"></div>
                  {company}
                </div>
              </a>
            ))}
          </div>
        </aside>

        <main className="main">
          <section className="hero">
            <h1>Master DSA with <span>XOR</span> — Think in Bitwise</h1>
            <p>Structured learning paths, 450+ curated problems, video explanations, and editorial solutions to crack any coding interview.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" type="button">🚀 Start Solving</button>
            </div>
          </section>

          <section className="section">
            <div className="section-title">📚 Topics</div>
            <div className="topic-grid">
              {[
                ['Arrays & Hashing', 'rgba(59,130,246,0.12)', '🧮'],
                ['Trees & BST', 'rgba(34,197,94,0.12)', '🌳'],
                ['Linked Lists', 'rgba(234,179,8,0.12)', '🔗'],
                ['Dynamic Programming', 'rgba(239,68,68,0.12)', '📊'],
                ['Graphs & BFS/DFS', 'rgba(168,85,247,0.12)', '🕸️'],
                ['Bit Manipulation', 'rgba(124,58,237,0.12)', '⚡'],
                ['Binary Search', 'rgba(20,184,166,0.12)', '🔍'],
                ['Recursion & Backtracking', 'rgba(249,115,22,0.12)', '🎯'],
              ].map(([name, bg, emoji]) => {
                const filterMap = {
                  'Arrays & Hashing': 'Arrays & Hashing',
                  'Trees & BST': 'Trees & BST',
                  'Linked Lists': 'Linked List',
                  'Dynamic Programming': 'Dynamic Programming',
                  'Graphs & BFS/DFS': 'Graph & DFS/BFS',
                  'Bit Manipulation': 'Bit Manipulation',
                  'Binary Search': 'Binary Search',
                  'Recursion & Backtracking': 'Recursion & Backtracking'
                };
                const filterValue = filterMap[name]
                const isActive = activeFilter === filterValue
                const count = getTopicCount(name)
                const progress = getTopicProgress(name)
                
                return (
                  <div 
                    className={`topic-card ${isActive ? 'active-card' : ''}`} 
                    key={name}
                    onClick={() => {
                      if (isActive) {
                        applyFilter('All')
                      } else {
                        applyFilter(filterValue)
                        setTimeout(() => {
                          const el = document.getElementById('problems-list-section')
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' })
                          }
                        }, 50)
                      }
                    }}
                  >
                    <div className="topic-icon" style={{ background: bg }}>{emoji}</div>
                    <div className="topic-name">{name}</div>
                    <div className="topic-count">{count} problems</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: progress }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="tabs">
            {['All Problems', 'Easy', 'Medium', 'Hard', 'Bookmarked'].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                type="button"
                onClick={() => applyTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <section id="problems-list-section" className="section problem-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search problems by title, tag, or company..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="glow-chip">✓ {solvedProblemIds.size} solved</span>
            </div>

            <div className="filter-row">
              {['All', 'Arrays & Hashing', 'Trees & BST', 'Linked List', 'Dynamic Programming', 'Graph & DFS/BFS', 'Bit Manipulation', 'Binary Search', 'Recursion & Backtracking'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  type="button"
                  onClick={() => applyFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table className="problem-table">
                <thead>
                  <tr>
                    <th className="check-col">✓</th>
                    <th>Title</th>
                    <th>Tags</th>
                    <th>Difficulty</th>
                    <th>Companies</th>
                    <th>Resources</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProblems.map((problem) => (
                    <tr className="problem-row" key={problem.id}>
                      <td
                        onClick={() => handleToggleSolve(problem.id)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {solvedProblemIds.has(problem.id) ? (
                          <span className="check-icon">✓</span>
                        ) : (
                          <span className="unchecked">○</span>
                        )}
                      </td>
                      <td>
                        {problem.url ? (
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="problem-title-link"
                            onClick={() => handleSolveProblem(problem.id)}
                          >
                            {problem.title}
                          </a>
                        ) : (
                          <span className="problem-title">{problem.title}</span>
                        )}
                      </td>
                      <td>
                        {problem.tags.map((tag) => (
                          <span className="tag" key={tag}>{tag}</span>
                        ))}
                      </td>
                      <td><span className={`badge ${diffClass[problem.diff]}`}>{problem.diff}</span></td>
                      <td className="companies-cell">{problem.companies.slice(0, 2).join(', ')}</td>
                      <td>
                        <button className="resource-btn video" type="button" onClick={(event) => { event.stopPropagation(); alert('Upcoming features'); }}>▶ Video</button>
                        <button
                          className={`resource-btn note ${!!notes[problem.id] ? 'has-note' : ''}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveNoteProblemId(problem.id);
                            setNoteText(notes[problem.id] || '');
                          }}
                        >
                          📄 {!!notes[problem.id] ? 'Edit Note' : 'Note'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer>
            <div>© 2025 XOR — Built for learners, by learners.</div>
            <div className="footer-links">
              <a href="#" onClick={(event) => event.preventDefault()}>Privacy</a>
              <a href="#" onClick={(event) => event.preventDefault()}>Terms</a>
              <a href="#" onClick={(event) => event.preventDefault()}>GitHub</a>
              <a href="#" onClick={(event) => event.preventDefault()}>Discord</a>
            </div>
          </footer>
        </main>

        <aside className="right-panel">
          <div className="panel-card">
            <div className="panel-card-title">🔥 Current Streak</div>
            <div className="streak-num">{streak} <span className="streak-days">days</span></div>
            <div className="streak-sub">Keep going! Best: {bestStreak} days</div>
            <div className="heatmap">
              {heatmapLevels.map((level, index) => (
                <div key={index} className={`heat-cell ${level ? `l${level}` : ''}`}></div>
              ))}
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-card-title">📈 Your Progress</div>
            <div className="progress-summary">
              <div>
                <div className="progress-label easy">Easy</div>
                <div className="progress-num">{solvedEasy} <span>/{totalEasy}</span></div>
              </div>
              <div>
                <div className="progress-label medium">Med</div>
                <div className="progress-num">{solvedMedium} <span>/{totalMedium}</span></div>
              </div>
              <div>
                <div className="progress-label hard">Hard</div>
                <div className="progress-num">{solvedHard} <span>/{totalHard}</span></div>
              </div>
            </div>
            <div className="progress-bars">
              <div>
                <div className="mini-row"><span className="easy">Easy</span><span>{percentEasy}%</span></div>
                <div className="progress-bar"><div className="progress-fill easy-fill" style={{ width: `${percentEasy}%` }}></div></div>
              </div>
              <div>
                <div className="mini-row"><span className="medium">Medium</span><span>{percentMedium}%</span></div>
                <div className="progress-bar"><div className="progress-fill medium-fill" style={{ width: `${percentMedium}%` }}></div></div>
              </div>
              <div>
                <div className="mini-row"><span className="hard">Hard</span><span>{percentHard}%</span></div>
                <div className="progress-bar"><div className="progress-fill hard-fill" style={{ width: `${percentHard}%` }}></div></div>
              </div>
            </div>
          </div>


          <div className="panel-card daily-card">
            <div className="panel-card-title">⚡ Daily Challenge</div>
            <div className="daily-title">{dailyProblem.title}</div>
            <span className={`badge ${diffClass[dailyProblem.diff] || 'badge-medium'}`}>{dailyProblem.diff}</span>
            <div className="daily-desc" style={{ marginTop: '8px' }}>
              <strong>Tags:</strong> {dailyProblem.tags.join(', ')}
            </div>
            <button 
              className="btn btn-primary daily-btn" 
              type="button" 
              onClick={() => window.open(dailyProblem.url, '_blank')}
            >
              Solve Now →
            </button>
          </div>
        </aside>
      </div>

      {activeNoteProblemId !== null && (
        <div className="modal-overlay" onClick={() => setActiveNoteProblemId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notes for {problems.find(p => p.id === activeNoteProblemId)?.title}</h3>
              <button className="modal-close" onClick={() => setActiveNoteProblemId(null)}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your notes here... (approach, pseudocode, complexity analysis etc.)"
                rows={10}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setActiveNoteProblemId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
