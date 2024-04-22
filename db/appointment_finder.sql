-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2024 at 11:36 PM
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
(120, 'Projekt Kick-off', 'Online (Zoom)', '2024-04-20', '2024-04-20', 'Erstes Treffen des Entwicklungsteams für das neue Kundenportal.', 'Maria Schmidt'),
(121, 'Jahresabschlusspräsentation', 'Hauptbüro, Raum 2001', '2024-04-22', '2024-04-22', 'Präsentation der Geschäftsergebnisse und -ziele für das nächste Jahr.', 'John Doe'),
(122, 'Teambuilding-Workshop', 'Eventhalle Nord', '2024-04-26', '2024-04-23', 'Workshop zur Stärkung der Teamdynamik und Verbesserung der Kommunikation.\n', 'Maria Schmidt'),
(124, 'Fussball Event', 'Soocerdome', '2024-04-26', '2024-04-25', '', 'Johannes Schlotterberg'),
(125, 'Sprint Meetings', 'Zoom', '2024-04-27', '2024-04-21', 'Jeder Zeigt seine Ergebnisse', 'Mark Zuckerberg');

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
(183, 120, '2024-04-20 06:00:00', '2024-04-20 06:20:00', '2024-04-20'),
(184, 120, '2024-04-20 06:20:00', '2024-04-20 06:40:00', '2024-04-20'),
(185, 120, '2024-04-20 06:40:00', '2024-04-20 07:00:00', '2024-04-20'),
(187, 121, '2024-04-22 06:00:00', '2024-04-22 07:00:00', '2024-04-22'),
(188, 121, '2024-04-22 09:00:00', '2024-04-22 10:00:00', '2024-04-22'),
(189, 121, '2024-04-22 10:00:00', '2024-04-22 11:00:00', '2024-04-22'),
(190, 121, '2024-04-22 11:00:00', '2024-04-22 12:00:00', '2024-04-22'),
(191, 122, '2024-04-22 07:00:00', '2024-04-22 07:30:00', '2024-04-26'),
(192, 122, '2024-04-22 08:00:00', '2024-04-22 08:30:00', '2024-04-26'),
(193, 122, '2024-04-22 08:30:00', '2024-04-22 09:00:00', '2024-04-26'),
(201, 124, '2024-04-22 06:40:00', '2024-04-22 07:20:00', '2024-04-26'),
(202, 124, '2024-04-22 07:40:00', '2024-04-22 08:20:00', '2024-04-26'),
(203, 124, '2024-04-22 08:40:00', '2024-04-22 09:20:00', '2024-04-26'),
(204, 124, '2024-04-22 09:00:00', '2024-04-22 09:40:00', '2024-04-26'),
(205, 125, '2024-04-22 06:30:00', '2024-04-22 06:45:00', '2024-04-27'),
(206, 125, '2024-04-22 06:45:00', '2024-04-22 07:00:00', '2024-04-27'),
(207, 125, '2024-04-22 07:00:00', '2024-04-22 07:15:00', '2024-04-27'),
(208, 125, '2024-04-22 07:15:00', '2024-04-22 07:30:00', '2024-04-27'),
(209, 125, '2024-04-22 07:30:00', '2024-04-22 07:45:00', '2024-04-27');

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
(70, 'Andy'),
(71, 'Nicencss'),
(72, 'Vamos'),
(73, 'dsa'),
(74, 'dsa'),
(75, 'dsa'),
(76, 'Mina Mansour'),
(77, 'Bertan'),
(78, 'Max Mustermann'),
(79, 'Filip Barken'),
(80, 'Bertan Tan'),
(81, 'Mina Mansour'),
(82, 'Bertan Tan'),
(83, 'das'),
(84, 'Bertan Tan'),
(85, 'Mina Mansour'),
(86, 'Filip Johannesberg'),
(87, 'Max Musterknabe'),
(88, 'Mina Mansour'),
(89, 'Bertan Tan');

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
(134, 78, 191, ''),
(135, 78, 192, ''),
(136, 79, 192, 'Komme mit einer Begleitung'),
(137, 79, 193, 'Komme mit einer Begleitung'),
(138, 80, 192, ''),
(142, 84, 183, 'Komme pünktlich'),
(143, 84, 184, 'Komme pünktlich'),
(144, 84, 185, 'Komme pünktlich'),
(145, 85, 184, ''),
(146, 85, 185, ''),
(147, 86, 205, ''),
(148, 87, 207, 'Yes Sir!'),
(149, 88, 187, 'Haben keine Präsi sorry!'),
(150, 88, 188, 'Haben keine Präsi sorry!'),
(151, 89, 189, 'Wir haben eine Präse'),
(152, 89, 190, 'Wir haben eine Präse');

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
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `users_slots`
--
ALTER TABLE `users_slots`
  MODIFY `user_slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

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
