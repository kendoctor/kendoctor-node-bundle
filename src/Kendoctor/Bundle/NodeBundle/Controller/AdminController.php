<?php

namespace Kendoctor\Bundle\NodeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\SecurityContext;

class AdminController extends Controller
{

    /**
     * @Route("/admin", name="admin_homepage")
     * @Template()
     * @return Response or Array
     */
    public function indexAction()
    {
        return array();
    }

}
