-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2024 at 05:40 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment_finder`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `location` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `organizer_name` varchar(300) NOT NULL DEFAULT 'Mina'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `title`, `location`, `date`, `expiry_date`, `description`, `organizer_name`) VALUES
(110, 'Business', 'Vienna', '2024-04-21', '2024-04-21', 'Test', 'Bertan Taan'),
(111, 'Fussball', 'London', '2024-04-23', '2024-04-23', 'KOmm gema', 'Mina Mansour');

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `slot_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end` timestamp NOT NULL DEFAULT current_timestamp(),
  `date` date NOT NULL DEFAULT '2022-10-10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` (`slot_id`, `appointment_id`, `start`, `end`, `date`) VALUES
(162, 110, '2024-04-21 15:00:00', '2024-04-21 15:30:00', '2024-04-21'),
(163, 110, '2024-04-21 15:30:00', '2024-04-21 16:00:00', '2024-04-21'),
(164, 110, '2024-04-21 14:30:00', '2024-04-21 15:00:00', '2024-04-21'),
(165, 110, '2024-04-21 16:00:00', '2024-04-21 16:30:00', '2024-04-21'),
(166, 111, '2024-04-21 16:00:00', '2024-04-21 16:20:00', '2024-04-23'),
(167, 111, '2024-04-21 15:00:00', '2024-04-21 15:20:00', '2024-04-23'),
(168, 111, '2024-04-21 16:20:00', '2024-04-21 16:40:00', '2024-04-23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`) VALUES
(67, 'Mina Mansour'),
(68, 'Andy'),
(69, 'Bertan'),
(70, 'Andy');

-- --------------------------------------------------------

--
-- Table structure for table `users_slots`
--

CREATE TABLE `users_slots` (
  `user_slot_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_slots`
--

INSERT INTO `users_slots` (`user_slot_id`, `user_id`, `slot_id`, `comment`) VALUES
(113, 67, 162, 'Vamos'),
(114, 67, 163, 'Vamos'),
(115, 68, 164, 'Manyak'),
(116, 68, 163, 'Manyak'),
(117, 69, 166, 'Nice'),
(118, 69, 168, 'Nice'),
(119, 69, 167, 'Nice'),
(120, 70, 166, 'Niceness'),
(121, 70, 167, 'Niceness');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `slots`
--
ALTER TABLE `slots`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `fk_appointment_id` (`appointment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users_slots`
--
ALTER TABLE `users_slots`
  ADD PRIMARY KEY (`user_slot_id`),
  ADD KEY `fk_slot_id` (`slot_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `users_slots`
--
ALTER TABLE `users_slots`
  MODIFY `user_slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `slots`
--
ALTER TABLE `slots`
  ADD CONSTRAINT `fk_appointment_id` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_slots`
--
ALTER TABLE `users_slots`
  ADD CONSTRAINT `fk_slot_id` FOREIGN KEY (`slot_id`) REFERENCES `slots` (`slot_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
