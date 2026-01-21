    package com.hospital.repositories;

    //Marks this class as a repository component in Spring
    import java.sql.Connection;
    import java.sql.PreparedStatement;
    import java.sql.ResultSet;
    import java.sql.SQLException;
    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;

    import org.springframework.stereotype.Repository;



    @Repository
    public class NotificationRepository {


        //Fetches epidemic-like diagnoses from the last month based on a threshold (10 in this case)
        public static List<Map<String, Object>> getEpidemicsLastMonth(int threshold) {
            String sql=
                "SELECT diagnosis, COUNT(*) AS cnt " +
                "FROM MEDICAL_REPORT " +
                "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) " +
                "  AND diagnosis IS NOT NULL AND diagnosis <> '' " +
                "GROUP BY diagnosis " +
                "HAVING COUNT(*) >= ? " +
                "ORDER BY cnt DESC";

            //Try-with-resources ensures DB connection&statement are closed automatically:
            try (Connection conn=DB.getConnection();
                PreparedStatement ps=conn.prepareStatement(sql)) {

                ps.setInt(1, threshold);

                ResultSet rs = ps.executeQuery();
                //List that will hold epidemic diagnosis data:
                List<Map<String, Object>> epidemics = new ArrayList<>();

                //Iterate over each row in the result set:
                while (rs.next()) {
                    //Each row represents one diagnosis and its occurrence count:
                    Map<String, Object> row = new HashMap<>();
                    //Diagnosis name (, Flu etc.)
                    row.put("diagnosis", rs.getString("diagnosis"));
                    //Number of occurrences in the last month:
                    row.put("count", rs.getInt("cnt"));
                    //Add the row to the epidemic list::
                    epidemics.add(row);
                }
                return epidemics; //our list of epidemics

            } catch (SQLException e) {
                //Log database-related errors etc..
                System.out.println("Error fetching epidemics: " + e.getMessage());
                e.printStackTrace();
                return null;
            }
        }

        public static boolean getPatientIfBloodTestOverdue(int patientssn) {
            String sql =
                    "SELECT NOT EXISTS ( " +
                            "   SELECT 1 " +
                            "   FROM test_result tr " +
                            "   WHERE tr.pssn = ? " +
                            "     AND tr.measured_at >= (NOW() - INTERVAL 6 MONTH) " +
                            ") AS overdue";
            try (Connection conn=DB.getConnection();
                 PreparedStatement ps=conn.prepareStatement(sql)) {
                ps.setInt(1, patientssn);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return rs.getBoolean("overdue");
                }
            }catch (SQLException e) {
                e.printStackTrace();
            }
            return false;
        }

        public static boolean checkDiscountEligibility(int patientssn) {
            String sql =
                    "SELECT (COUNT(aid) > 9) as discount_eligible " +
                    "   FROM patient join appointment on pssn = ssn " +
                    "   WHERE ssn = ? " +
                    "     AND appt_datetime > NOW() ";
            try (Connection conn=DB.getConnection();
                 PreparedStatement ps=conn.prepareStatement(sql)) {
                ps.setInt(1, patientssn);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return rs.getBoolean("discount_eligible");
                }
            }catch (SQLException e) {
                e.printStackTrace();
            }
            return false;
        }
        public static boolean hasAbnormalTests(int patientSsn) {

            String sql =
                    "SELECT EXISTS ( " +
                            "  SELECT 1 " +
                            "  FROM TEST_RESULT tr " +
                            "  JOIN TEST_TYPE tt ON tr.type_id = tt.type_id " +
                            "  WHERE tr.pssn = ? " +
                            "    AND (tr.value < tt.min_ref OR tr.value > tt.max_ref) " +
                            ") AS has_abnormal_tests";

            try (Connection conn = DB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {

                ps.setInt(1, patientSsn);

                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return rs.getBoolean("has_abnormal_tests");
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }

            return false;
        }


    }
